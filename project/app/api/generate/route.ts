import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerationOptions, Language, Length, Platform, Tone } from '@/types';

export const runtime = 'nodejs';

const toneDescriptions: Record<Tone, Record<Language, string>> = {
  professional: { en: 'professional, polished, and formal', ru: 'деловой, выдержанный и формальный' },
  persuasive: { en: 'persuasive and compelling', ru: 'убедительный и выразительный' },
  friendly: { en: 'warm, friendly, and approachable', ru: 'тёплый, дружелюбный и располагающий' },
  technical: { en: 'technical and precise, using domain terminology', ru: 'технический и точный, с профессиональной терминологией' },
  witty: { en: 'witty and clever, with a touch of humor', ru: 'остроумный, с лёгким юмором' },
};

const lengthInstructions: Record<Length, Record<Language, string>> = {
  short: { en: 'Keep it concise: one short paragraph or a few bullet points.', ru: 'Пиши кратко: один короткий абзац или несколько тезисов.' },
  medium: { en: 'Use 2–3 well-structured paragraphs.', ru: 'Используй 2–3 хорошо структурированных абзаца.' },
  detailed: { en: 'Write a detailed response of 3–4 paragraphs.', ru: 'Напиши развёрнутый ответ из 3–4 абзацев.' },
};

const platformInstructions: Record<Platform, Record<Language, string>> = {
  linkedin: { en: 'Format for LinkedIn with professional structure and relevant hashtags.', ru: 'Формат для LinkedIn: профессиональная структура и релевантные хэштеги.' },
  twitter: { en: 'Format for Twitter/X: concise and punchy, ideally under 280 characters, with 1–2 hashtags.', ru: 'Формат для Twitter/X: кратко и ёмко, желательно до 280 символов, с 1–2 хэштегами.' },
  telegram: { en: 'Format for Telegram: clear broadcast style; use bullets and emoji when appropriate.', ru: 'Формат для Telegram: ясный стиль рассылки; при необходимости используй тезисы и эмодзи.' },
  instagram: { en: 'Format for Instagram with line breaks, emoji, and relevant hashtags.', ru: 'Формат для Instagram: переносы строк, эмодзи и релевантные хэштеги.' },
};

function buildPrompt(opts: GenerationOptions): string {
  const languageName = opts.language === 'ru' ? 'Russian' : 'English';
  const tone = toneDescriptions[opts.tone][opts.language];
  const length = lengthInstructions[opts.length][opts.language];

  if (opts.mode === 'cover-letter') {
    const { jobTitle = '', company, skills = '' } = opts.coverLetter ?? {};
    return ['You are a professional copywriter specializing in cover letters.', `Write a cover letter in ${languageName}.`, `Job title: ${jobTitle}`, `Company: ${company || 'not specified'}`, `Key skills and experience: ${skills || 'not provided'}`, `Tone: ${tone}.`, length, 'Use first person. Do not invent specific facts; rely only on the supplied skills.', `Respond only in ${languageName}.`].join('\n');
  }

  const { topic = '', keyPoints = '', platform = 'linkedin' } = opts.socialPost ?? {};
  return ['You are a social media expert and copywriter.', `Write a social media post in ${languageName}.`, `Topic: ${topic}`, `Key points: ${keyPoints || 'not provided'}`, `Platform: ${platform}`, `Tone: ${tone}.`, platformInstructions[platform][opts.language], length, 'Write naturally and engagingly. Do not use Markdown headings.', `Respond only in ${languageName}.`].join('\n');
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API ключ GEMINI_API_KEY не найден в .env.local' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let opts: GenerationOptions;
  try {
    opts = (await request.json()) as GenerationOptions;
  } catch {
    return new Response(JSON.stringify({ error: 'Request body must be valid JSON.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (opts.mode !== 'cover-letter' && opts.mode !== 'social-post') {
    return new Response(JSON.stringify({ error: 'Invalid generation mode.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Используемый ключ:', apiKey ? `${apiKey.substring(0, 6)}...` : 'ОТСУТСТВУЕТ');
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-3.5-flash' });
    const result = await model.generateContentStream(buildPrompt(opts));
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' } });
  } catch (error) {
    console.error('GEMINI_ERROR:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
