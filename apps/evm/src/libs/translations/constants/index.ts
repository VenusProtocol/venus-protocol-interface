export interface SupportedLanguage {
  name: string;
  tag: string;
}

export const supportedLanguages: SupportedLanguage[] = [
  {
    name: 'English',
    tag: 'en',
  },
  { name: '简体中文', tag: 'zh-Hans' },
  { name: '繁體中文', tag: 'zh-Hant' },
  { name: '日本語', tag: 'ja' },
  { name: 'Tiếng Việt', tag: 'vi' },
  { name: 'ไทย', tag: 'th' },
  { name: 'Türkçe', tag: 'tr' },
];
