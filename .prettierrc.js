module.exports = {
  ...require('prettier-airbnb-config'),
  trailingComma: 'all',
  bracketSpacing: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '(__mocks__|assets|clients|components|config|constants|containers|context|errors|hooks|pages|stories|testUtils|theme|translation|types|utilities)/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
