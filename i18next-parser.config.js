module.exports = {
  defaultValue: 'TRANSLATION NEEDED',
  locales: ['en'],
  output: './src/translation/translations/$LOCALE.json',
  input: './src/**/*.{ts,tsx}',
  sort: true,
  createOldCatalogs: false,
};
