import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    const keys = key.split('.');
    let translation = translations[language];

    for (const k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        // Fallback to English if translation not found
        translation = translations.en;
        for (const fallbackKey of keys) {
          if (translation && translation[fallbackKey] !== undefined) {
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

  return { t, language };
};
