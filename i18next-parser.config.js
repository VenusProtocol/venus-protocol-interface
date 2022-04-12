module.exports = {
  defaultValue: 'TRANSLATION NEEDED',
  locales: ['en'],
  output: './src/translation/$LOCALE.json',
  input: './src/**/*.{ts,tsx}',
  sort: true,
  createOldCatalogs: false,
};
