import { format as formatDate, formatDistanceToNowStrict, isDate } from 'date-fns';
import { enUS } from 'date-fns/locale';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { supportedLanguages } from './constants';
import enLocales from './translations/en.json';
import jaLocales from './translations/ja.json';
import thLocales from './translations/th.json';
import trLocales from './translations/tr.json';
import viLocales from './translations/vi.json';
import zhHansLocales from './translations/zh-Hans.json';
import zhHantLocales from './translations/zh-Hant.json';

export { default as en } from './translations/en.json';

const init = () => {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enLocales,
        },
        th: {
          translation: thLocales,
        },
        tr: {
          translation: trLocales,
        },
        ja: {
          translation: jaLocales,
        },
        vi: {
          translation: viLocales,
        },
        'zh-Hans': {
          translation: zhHansLocales,
        },
        'zh-Hant': {
          translation: zhHantLocales,
        },
      },
      supportedLngs: supportedLanguages.map(language => language.bcp47Tag),
      fallbackLng: 'en',
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        // Normalize odd inputs like en_US -> en-US
        convertDetectedLanguage: (lng: string) => lng.replace('_', '-'),
      },
      interpolation: {
        escapeValue: false,
        format: (value, format, lng) => {
          const locales = { en: enUS };

          if (isDate(value)) {
            const locale =
              lng && lng in locales ? locales[lng as keyof typeof locales] : locales.en;
            if (format === 'distanceToNow') {
              return formatDistanceToNowStrict(value, { locale });
            }

            return formatDate(value, format || 'dd MMM yyyy h:mm a', { locale });
          }
          return value;
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
