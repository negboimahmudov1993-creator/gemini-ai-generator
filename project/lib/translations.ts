import type { Language, Tone, Length, Platform } from '@/types';

export interface UITexts {
  // Header
  badgeMvp: string;
  builtWith: string;
  toggleHistory: string;
  closeSidebar: string;
  languageLabel: string;
  languageEnglish: string;
  languageRussian: string;
  switchToLight: string;
  switchToDark: string;

  // Input form
  createContent: string;
  formDescription: string;
  coverLetter: string;
  socialPost: string;
  jobTitle: string;
  jobTitlePlaceholder: string;
  targetCompany: string;
  targetCompanyOptional: string;
  companyPlaceholder: string;
  keySkills: string;
  skillsPlaceholder: string;
  topic: string;
  topicPlaceholder: string;
  keyPoints: string;
  keyPointsPlaceholder: string;
  targetPlatform: string;
  tone: string;
  targetLength: string;
  generate: string;
  generating: string;

  // Tone labels
  tones: Record<Tone, string>;
  lengths: Record<Length, string>;
  platforms: Record<Platform, string>;

  // Output card
  output: string;
  words: string;
  chars: string;
  crafting: string;
  noContentTitle: string;
  noContentDesc: string;
  copy: string;
  copied: string;
  save: string;
  saved: string;
  regenerate: string;
  clear: string;
  copySuccessTitle: string;
  copySuccessDesc: string;
  copyFailedTitle: string;
  copyFailedDesc: string;
  saveToHistory: string;
  regenerateTooltip: string;
  clearTooltip: string;
  autoSaved: string;
  autoSavedDesc: string;

  // History sidebar
  history: string;
  favorites: string;
  recent: string;
  noHistoryTitle: string;
  noHistoryDesc: string;
  clearAllHistory: string;
  clearAllTitle: string;
  clearAllDesc: (n: number) => string;
  cancel: string;
  clearAll: string;
  removeFavorite: string;
  addToFavorites: string;
  delete: string;
  deleteFromHistory: string;

  // Relative time
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;

  // Toasts
  generationFailedTitle: string;
  generationFailedDesc: string;
  errorNoKeyTitle: string;
  errorNoKeyDesc: string;
  errorInvalidKeyTitle: string;
  errorInvalidKeyDesc: string;
  errorRateLimitTitle: string;
  errorRateLimitDesc: string;
  errorNetworkTitle: string;
  errorNetworkDesc: string;
  errorUnknownTitle: string;
  errorUnknownDesc: string;
  streaming: string;
}

export const translations: Record<Language, UITexts> = {
  en: {
    badgeMvp: 'MVP v1.0',
    builtWith: 'Built with Bolt',
    toggleHistory: 'Toggle history',
    closeSidebar: 'Close sidebar',
    languageLabel: 'Language',
    languageEnglish: 'English',
    languageRussian: 'Русский',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',

    createContent: 'Create Content',
    formDescription:
      'Choose a format, fill in the details, and let AI craft polished copy in seconds.',
    coverLetter: 'Cover Letter',
    socialPost: 'Social Post',
    jobTitle: 'Job Title / Position',
    jobTitlePlaceholder: 'e.g. Senior Product Designer',
    targetCompany: 'Target Company',
    targetCompanyOptional: 'Target Company (optional)',
    companyPlaceholder: 'e.g. Acme Corp',
    keySkills: 'Key Skills / Resume Context',
    skillsPlaceholder:
      'e.g.\n5+ years designing SaaS dashboards\nStrong prototyping skills in Figma\nExperience leading design systems',
    topic: 'Topic / Headline',
    topicPlaceholder: 'e.g. Why most product launches fail',
    keyPoints: 'Key Points / Bullet Points',
    keyPointsPlaceholder:
      'e.g.\nMost teams skip customer research\nMarketing launches too late\nPost-launch iteration is where wins happen',
    targetPlatform: 'Target Platform',
    tone: 'Tone',
    targetLength: 'Target Length',
    generate: 'Generate Content',
    generating: 'Generating...',

    tones: {
      professional: 'Professional',
      persuasive: 'Persuasive',
      friendly: 'Friendly',
      technical: 'Technical',
      witty: 'Witty',
    },
    lengths: {
      short: 'Short',
      medium: 'Medium',
      detailed: 'Detailed',
    },
    platforms: {
      linkedin: 'LinkedIn',
      twitter: 'Twitter / X',
      telegram: 'Telegram',
      instagram: 'Instagram',
    },

    output: 'Output',
    words: 'words',
    chars: 'chars',
    crafting: 'Crafting your content...',
    noContentTitle: 'No content yet',
    noContentDesc:
      'Fill in the form and hit Generate to see polished, AI-crafted copy appear here.',
    copy: 'Copy',
    copied: 'Copied',
    save: 'Save',
    saved: 'Saved',
    regenerate: 'Regenerate',
    clear: 'Clear',
    copySuccessTitle: 'Copied to clipboard',
    copySuccessDesc: 'Your generated content is ready to paste anywhere.',
    copyFailedTitle: 'Copy failed',
    copyFailedDesc: 'Your browser blocked clipboard access.',
    saveToHistory: 'Save to favorites / history',
    regenerateTooltip: 'Generate again with same settings',
    clearTooltip: 'Clear current output',
    autoSaved: 'Auto-saved to history',
    autoSavedDesc: 'Your generation is safely stored in the sidebar.',

    history: 'History',
    favorites: 'Favorites',
    recent: 'Recent',
    noHistoryTitle: 'No history yet',
    noHistoryDesc: 'Your generated content will appear here for quick access.',
    clearAllHistory: 'Clear all history',
    clearAllTitle: 'Clear all history?',
    clearAllDesc: (n: number) =>
      `This permanently removes all ${n} saved generation${n === 1 ? '' : 's'}. This action cannot be undone.`,
    cancel: 'Cancel',
    clearAll: 'Clear All',
    removeFavorite: 'Remove favorite',
    addToFavorites: 'Add to favorites',
    delete: 'Delete',
    deleteFromHistory: 'Delete from history',

    justNow: 'Just now',
    minutesAgo: (n: number) => `${n}m ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    daysAgo: (n: number) => `${n}d ago`,

    generationFailedTitle: 'Generation failed',
    generationFailedDesc:
      'Something went wrong while generating content. Please try again.',
    errorNoKeyTitle: 'API key not configured',
    errorNoKeyDesc:
      'Add NEXT_PUBLIC_GEMINI_API_KEY to enable AI generation. Using mock mode for now.',
    errorInvalidKeyTitle: 'Invalid API key',
    errorInvalidKeyDesc:
      'Your Gemini API key is invalid or expired. Please check your configuration.',
    errorRateLimitTitle: 'Rate limit exceeded',
    errorRateLimitDesc:
      'You have hit the Gemini API rate limit. Please wait a moment and try again.',
    errorNetworkTitle: 'Network error',
    errorNetworkDesc:
      'Could not reach the Gemini API. Check your internet connection and try again.',
    errorUnknownTitle: 'Generation error',
    errorUnknownDesc:
      'An unexpected error occurred. Please try again.',
    streaming: 'Streaming response...',
  },

  ru: {
    badgeMvp: 'MVP v1.0',
    builtWith: 'Создано на Bolt',
    toggleHistory: 'Показать историю',
    closeSidebar: 'Закрыть панель',
    languageLabel: 'Язык',
    languageEnglish: 'English',
    languageRussian: 'Русский',
    switchToLight: 'Переключить на светлую тему',
    switchToDark: 'Переключить на тёмную тему',

    createContent: 'Создать контент',
    formDescription:
      'Выберите формат, заполните поля — и ИИ создаст качественный текст за секунды.',
    coverLetter: 'Сопроводительное письмо',
    socialPost: 'Пост для соцсетей',
    jobTitle: 'Должность / позиция',
    jobTitlePlaceholder: 'напр. Старший продуктовый дизайнер',
    targetCompany: 'Компания',
    targetCompanyOptional: 'Компания (необязательно)',
    companyPlaceholder: 'напр. Acme Corp',
    keySkills: 'Ключевые навыки / опыт',
    skillsPlaceholder:
      'напр.\n5+ лет дизайна SaaS-дашбордов\nУверенное прототипирование в Figma\nОпыт работы с дизайн-системами',
    topic: 'Тема / заголовок',
    topicPlaceholder: 'напр. Почему большинство запусков проваливаются',
    keyPoints: 'Ключевые тезисы',
    keyPointsPlaceholder:
      'напр.\nКоманды пропускают исследование\nМаркетинг запаздывает\nИтерации после запуска решают всё',
    targetPlatform: 'Платформа',
    tone: 'Тон',
    targetLength: 'Объём',
    generate: 'Сгенерировать',
    generating: 'Генерация...',

    tones: {
      professional: 'Деловой',
      persuasive: 'Убеждающий',
      friendly: 'Дружелюбный',
      technical: 'Технический',
      witty: 'Остроумный',
    },
    lengths: {
      short: 'Краткий',
      medium: 'Средний',
      detailed: 'Подробный',
    },
    platforms: {
      linkedin: 'LinkedIn',
      twitter: 'Twitter / X',
      telegram: 'Telegram',
      instagram: 'Instagram',
    },

    output: 'Результат',
    words: 'слов',
    chars: 'симв.',
    crafting: 'Создаём контент...',
    noContentTitle: 'Пока пусто',
    noContentDesc:
      'Заполните форму и нажмите «Сгенерировать» — здесь появится готовый текст.',
    copy: 'Копировать',
    copied: 'Скопировано',
    save: 'Сохранить',
    saved: 'Сохранено',
    regenerate: 'Заново',
    clear: 'Очистить',
    copySuccessTitle: 'Скопировано в буфер',
    copySuccessDesc: 'Текст готов для вставки в любое место.',
    copyFailedTitle: 'Не удалось скопировать',
    copyFailedDesc: 'Браузер заблокировал доступ к буферу обмена.',
    saveToHistory: 'Сохранить в избранное / историю',
    regenerateTooltip: 'Сгенерировать с теми же настройками',
    clearTooltip: 'Очистить текущий результат',
    autoSaved: 'Сохранено в историю',
    autoSavedDesc: 'Результат автоматически добавлен в боковую панель.',

    history: 'История',
    favorites: 'Избранное',
    recent: 'Недавние',
    noHistoryTitle: 'История пуста',
    noHistoryDesc: 'Сгенерированный контент появится здесь для быстрого доступа.',
    clearAllHistory: 'Очистить всю историю',
    clearAllTitle: 'Очистить всю историю?',
    clearAllDesc: (n: number) =>
      `Будет удалено ${n} сохранённ${n === 1 ? 'ая генерация' : n < 5 ? 'ые генерации' : 'ых генераций'}. Действие нельзя отменить.`,
    cancel: 'Отмена',
    clearAll: 'Очистить',
    removeFavorite: 'Убрать из избранного',
    addToFavorites: 'В избранное',
    delete: 'Удалить',
    deleteFromHistory: 'Удалить из истории',

    justNow: 'Только что',
    minutesAgo: (n: number) => `${n} мин назад`,
    hoursAgo: (n: number) => `${n} ч назад`,
    daysAgo: (n: number) => `${n} дн назад`,

    generationFailedTitle: 'Ошибка генерации',
    generationFailedDesc:
      'Что-то пошло не так. Попробуйте ещё раз.',
    errorNoKeyTitle: 'API-ключ не настроен',
    errorNoKeyDesc:
      'Добавьте NEXT_PUBLIC_GEMINI_API_KEY для включения ИИ. Сейчас используется демо-режим.',
    errorInvalidKeyTitle: 'Недействительный API-ключ',
    errorInvalidKeyDesc:
      'Ваш Gemini API-ключ недействителен или истёк. Проверьте настройки.',
    errorRateLimitTitle: 'Превышен лимит запросов',
    errorRateLimitDesc:
      'Вы превысили лимит запросов к Gemini API. Подождите немного и попробуйте снова.',
    errorNetworkTitle: 'Ошибка сети',
    errorNetworkDesc:
      'Не удалось подключиться к Gemini API. Проверьте интернет-соединение и попробуйте снова.',
    errorUnknownTitle: 'Ошибка генерации',
    errorUnknownDesc:
      'Произошла непредвиденная ошибка. Попробуйте ещё раз.',
    streaming: 'Получение ответа...',
  },
};
