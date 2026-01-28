import { type Locale, enUS, ja, th, tr, vi, zhCN, zhTW } from 'date-fns/locale';
import type { ResourceLanguage } from 'i18next';

import enTranslations from '../translations/en.json';
import jaTranslations from '../translations/ja.json';
import thTranslations from '../translations/th.json';
import trTranslations from '../translations/tr.json';
import viTranslations from '../translations/vi.json';
import zhHansTranslations from '../translations/zh-Hans.json';
import zhHantTranslations from '../translations/zh-Hant.json';

export type DateFormatType = 'textual' | 'textualWithTime' | 'numeric' | 'numericWithTime' | 'time';

export interface SupportedLanguage {
  name: string;
  bcp47Tag: string;
  locale: Locale;
  dateFormats: Record<DateFormatType, string>;
  translations: ResourceLanguage;
}

export const supportedLanguages: SupportedLanguage[] = [
  {
    name: 'English',
    bcp47Tag: 'en',
    locale: enUS,
    dateFormats: {
      textual: 'MMM d, yyyy',
      textualWithTime: 'MMM d, yyyy h:mm a',
      numeric: 'MM/dd/yy',
      numericWithTime: 'MM/dd/yy h:mm a',
      time: 'h:mm a',
    },
    translations: enTranslations,
  },
  {
    name: '简体中文',
    bcp47Tag: 'zh-Hans',
    locale: zhCN,
    dateFormats: {
      textual: 'yyyy年M月d日',
      textualWithTime: 'yyyy年M月d日 HH:mm',
      numeric: 'yyyy/MM/dd',
      numericWithTime: 'yyyy/MM/dd HH:mm',
      time: 'HH:mm',
    },
    translations: zhHansTranslations,
  },
  {
    name: '繁體中文',
    bcp47Tag: 'zh-Hant',
    locale: zhTW,
    dateFormats: {
      textual: 'yyyy年M月d日',
      textualWithTime: 'yyyy年M月d日 HH:mm',
      numeric: 'yyyy/MM/dd',
      numericWithTime: 'yyyy/MM/dd HH:mm',
      time: 'HH:mm',
    },
    translations: zhHantTranslations,
  },
  {
    name: '日本語',
    bcp47Tag: 'ja',
    locale: ja,
    dateFormats: {
      textual: 'yyyy年M月d日',
      textualWithTime: 'yyyy年M月d日 HH:mm',
      numeric: 'yyyy/MM/dd',
      numericWithTime: 'yyyy/MM/dd HH:mm',
      time: 'HH:mm',
    },
    translations: jaTranslations,
  },
  {
    name: 'Tiếng Việt',
    bcp47Tag: 'vi',
    locale: vi,
    dateFormats: {
      textual: 'd MMM yyyy',
      textualWithTime: 'd MMM yyyy HH:mm',
      numeric: 'dd/MM/yy',
      numericWithTime: 'dd/MM/yy HH:mm',
      time: 'HH:mm',
    },
    translations: viTranslations,
  },
  {
    name: 'ไทย',
    bcp47Tag: 'th',
    locale: th,
    dateFormats: {
      textual: 'd MMM yyyy',
      textualWithTime: 'd MMM yyyy HH:mm',
      numeric: 'dd/MM/yy',
      numericWithTime: 'dd/MM/yy HH:mm',
      time: 'HH:mm',
    },
    translations: thTranslations,
  },
  {
    name: 'Türkçe',
    bcp47Tag: 'tr',
    locale: tr,
    dateFormats: {
      textual: 'd MMM yyyy',
      textualWithTime: 'd MMM yyyy HH:mm',
      numeric: 'dd.MM.yy',
      numericWithTime: 'dd.MM.yy HH:mm',
      time: 'HH:mm',
    },
    translations: trTranslations,
  },
];
