export type GenerationMode = 'cover-letter' | 'social-post';

export type Tone = 'professional' | 'persuasive' | 'friendly' | 'technical' | 'witty';

export type Length = 'short' | 'medium' | 'detailed';

export type Platform = 'linkedin' | 'twitter' | 'telegram' | 'instagram';

export type Language = 'en' | 'ru';

export interface CoverLetterInput {
  jobTitle: string;
  company?: string;
  skills: string;
}

export interface SocialPostInput {
  topic: string;
  keyPoints: string;
  platform: Platform;
}

export interface GenerationOptions {
  mode: GenerationMode;
  tone: Tone;
  length: Length;
  language: Language;
  coverLetter?: CoverLetterInput;
  socialPost?: SocialPostInput;
}

export interface HistoryItem {
  id: string;
  title: string;
  content: string;
  mode: GenerationMode;
  tone: Tone;
  length: Length;
  language: Language;
  platform?: Platform;
  wordCount: number;
  charCount: number;
  createdAt: string;
  favorite: boolean;
}

export interface GenerationResult {
  content: string;
  title: string;
  wordCount: number;
  charCount: number;
}
