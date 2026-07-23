import { type Locale, enUS, ja, th, tr, vi, zhCN, zhTW } from 'date-fns/locale';

export type DateFormatType = 'textual' | 'textualWithTime' | 'numeric' | 'numericWithTime' | 'time';

export interface SupportedLanguage {
  name: string;
  bcp47Tag: string;
  locale: Locale;
  dateFormats: Record<DateFormatType, string>;
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
  },
];
