import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';
import es_mx from './locales/es-mx.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';

const resources = {
  'en-US': { translation: en },
  'pt-BR': { translation: pt },
  'es-ES': { translation: es },
  'es-MX': { translation: es_mx },
  'de-DE': { translation: de },
  'fr-FR': { translation: fr },
  'hi-IN': { translation: hi },
  'ja-JP': { translation: ja },
  'zh-CN': { translation: zh },
  'ko-KR': { translation: ko },
  'ru-RU': { translation: ru }
};

export const supportedLanguages = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' }
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    lng: 'pt-BR', // Default language
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'darknews-language'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;