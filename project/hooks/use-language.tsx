'use client';

import * as React from 'react';
import type { Language } from '@/types';
import { translations, type UITexts } from '@/lib/translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: UITexts;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'vibegen-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Language>('en');

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ru') {
        setLangState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = React.useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = React.useMemo(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
