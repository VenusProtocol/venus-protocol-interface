import React from 'react';
import i18next, { TFunctionKeys } from 'i18next';
import {
  initReactI18next,
  useTranslation as useI18NextTranslation,
  Trans as I18NextTrans,
  TransProps as I18NextTransProps,
} from 'react-i18next';

import EnLocales from './translations/en.json';

export const init = () =>
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
    },
  });

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

// Only use this function when you need to render a string from outside a
// component. Otherwise, use the t function or Trans component returned by the
// useTranslation hook.
export const t = (params: TFunctionKeys, values?: Record<string, unknown>) =>
  i18next.t(params, values);
