import { format as formatDate, formatDistanceStrict, isDate } from 'date-fns';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { supportedLanguages } from './constants';
import { enTranslations } from './loadTranslations';
import { resolveDateFormat } from './resolveDateFormat';
import { viteTranslationBackend } from './viteTranslationBackend';

export { default as en } from './translations/en.json';

export { supportedLanguages } from './constants';

export const defaultLanguage = supportedLanguages[0];

const init = () => {
  i18next
    .use(viteTranslationBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslations,
        },
      },
      partialBundledLanguages: true,
      supportedLngs: supportedLanguages.map(language => language.bcp47Tag),
      fallbackLng: defaultLanguage.bcp47Tag,
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        // Normalize odd inputs like en_US -> en-US
        convertDetectedLanguage: (lng: string) => lng.replace('_', '-'),
      },
      interpolation: {
        escapeValue: false,
        format: (value, format, tag) => {
          if (!isDate(value)) {
            return value;
          }

          const language =
            supportedLanguages.find(language => language.bcp47Tag === tag) ?? defaultLanguage;
          const options = { locale: language.locale };
          const resolvedFormat = resolveDateFormat(language, format);

          if (resolvedFormat === 'distanceToNow') {
            return formatDistanceStrict(value, new Date(), options);
          }

          return formatDate(value, resolvedFormat, options);
        },
      },
    });
  i18next.loadNamespaces('errors');
  return i18next;
};

const i18NextInstance = init();

// Only use this function when you need to render a string from outside a
// component. Otherwise, use the t function or Trans component returned by the
// useTranslation hook.
export const { t, changeLanguage } = i18NextInstance;

export * from './useTranslation';
