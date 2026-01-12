module.exports = {
  defaultValue: 'TRANSLATION NEEDED',
  locales: ['en', 'zh-CN', 'zh-TW', 'ja', 'vi', 'th', 'tr'],
  output: './src/libs/translations/translations/$LOCALE.json',
  input: './src/**/*.{ts,tsx}',
  sort: true,
  createOldCatalogs: false,
};
