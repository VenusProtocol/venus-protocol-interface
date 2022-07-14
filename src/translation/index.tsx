import { format as formatDate, formatDistanceToNowStrict, isDate } from 'date-fns';
import { enUS } from 'date-fns/locale';
import i18next, { TFunctionKeys } from 'i18next';
import React from 'react';
import {
  Trans as I18NextTrans,
  TransProps as I18NextTransProps,
  initReactI18next,
  useTranslation as useI18NextTranslation,
} from 'react-i18next';

import EnLocales from './translations/en.json';

const init = () => {
  i18next.use(initReactI18next).init({
    resources: {
      en: {
        translation: EnLocales,
      },
    },
    lng: 'en', // We only support English for now, but we'll need to detect the user's locale once we support more languages
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        const locales = { en: enUS };

        if (isDate(value)) {
          const locale = lng && lng in locales ? locales[lng as keyof typeof locales] : locales.en;
          if (format === 'distanceToNow') {
            return formatDistanceToNowStrict(value, { locale });
          }

          return formatDate(value, format || 'dd MMM yyyy HH:mm a', { locale });
        }
        return value;
      },
    },
  });
  i18next.loadNamespaces('errors');
  return i18next;
};

interface TransProps extends Omit<I18NextTransProps<'t'>, 't' | 'i18nKey'> {
  i18nKey: string;
}

export const useTranslation = () => {
  const { t } = useI18NextTranslation();

  const Trans: React.FC<TransProps> = ({ children, ...otherProps }) => (
    <I18NextTrans t={t} {...otherProps}>
      {children}
    </I18NextTrans>
  );

  return {
    t,
    Trans,
  };
};

const i18NextInstance = init();

// Only use this function when you need to render a string from outside a
// component. Otherwise, use the t function or Trans component returned by the
// useTranslation hook.
export const t = (params: TFunctionKeys, values?: Record<string, unknown>) =>
  i18NextInstance.t(params, values);
