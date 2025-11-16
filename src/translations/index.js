import { translations_en } from './en';
import { translations_my } from './my';

export const translations = {
  en: translations_en,
  my: translations_my
};

export const getTranslation = (language, key) => {
  const keys = key.split('.');
  let translation = translations[language];

  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // Fallback to English if translation not found
      translation = translations.en;
      for (const fallbackKey of keys) {
        if (translation && translation[fallbackKey]) {
          translation = translation[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      return translation;
    }
  }

  return translation;
};
