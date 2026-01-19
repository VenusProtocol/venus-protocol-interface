export interface SupportedLanguage {
  name: string;
  bcp47Tag: string;
}

export const supportedLanguages: SupportedLanguage[] = [
  {
    name: 'English',
    bcp47Tag: 'en',
  },
  { name: '简体中文', bcp47Tag: 'zh-Hans' },
  { name: '繁體中文', bcp47Tag: 'zh-Hant' },
  { name: '日本語', bcp47Tag: 'ja' },
  { name: 'Tiếng Việt', bcp47Tag: 'vi' },
  { name: 'ไทย', bcp47Tag: 'th' },
  { name: 'Türkçe', bcp47Tag: 'tr' },
];
