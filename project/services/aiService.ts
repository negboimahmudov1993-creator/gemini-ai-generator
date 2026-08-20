import type { GenerationOptions, GenerationResult } from '@/types';

export type StreamCallback = (chunk: string, accumulated: string) => void;

export interface GenerationError {
  type: 'no-key' | 'invalid-key' | 'rate-limit' | 'network' | 'unknown';
  message: string;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function buildTitle(opts: GenerationOptions): string {
  if (opts.mode === 'cover-letter') {
    const role = opts.coverLetter?.jobTitle || (opts.language === 'ru' ? 'Сопроводительное письмо' : 'Cover Letter');
    const company = opts.coverLetter?.company ? ` — ${opts.coverLetter.company}` : '';
    return `${role}${company}`;
  }
  return opts.socialPost?.topic || (opts.language === 'ru' ? 'Пост' : 'Social Post');
}

export function classifyError(err: unknown): GenerationError {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes('gemini_api_key') || lower.includes('api key is not configured')) return { type: 'no-key', message: msg };
  if (lower.includes('api key not valid') || lower.includes('api_key_invalid') || lower.includes('permission denied') || lower.includes('unauthenticated')) return { type: 'invalid-key', message: msg };
  if (lower.includes('429') || lower.includes('rate limit') || lower.includes('quota')) return { type: 'rate-limit', message: msg };
  if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('fetch')) return { type: 'network', message: msg };
  return { type: 'unknown', message: msg };
}

/** Streams generated text from the server-side Gemini proxy. */
export async function generateContentStream(opts: GenerationOptions, onChunk: StreamCallback): Promise<GenerationResult> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opts),
    });

    if (!response.ok) {
      const data = await response.json() as { error?: string };
      throw new Error(data.error || `HTTP Error ${response.status}`);
    }
    if (!response.body) throw new Error('Generation API returned an empty response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          accumulated += chunk;
          onChunk(chunk, accumulated);
        }
      }

      const trailingText = decoder.decode();
      if (trailingText) {
        accumulated += trailingText;
        onChunk(trailingText, accumulated);
      }
    } finally {
      reader.releaseLock();
    }

    return { content: accumulated, title: buildTitle(opts), wordCount: countWords(accumulated), charCount: accumulated.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}

/** Non-streaming compatibility wrapper. */
export async function generateContent(opts: GenerationOptions): Promise<GenerationResult> {
  return generateContentStream(opts, () => undefined);
}
