'use client';

import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/types';

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Language)}>
      <SelectTrigger
        aria-label={t.languageLabel}
        className="h-9 w-[120px] gap-1.5 border-border/60 bg-background/60 px-3 text-sm backdrop-blur transition-all duration-200 hover:scale-105"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t.languageEnglish}</SelectItem>
        <SelectItem value="ru">{t.languageRussian}</SelectItem>
      </SelectContent>
    </Select>
  );
}
