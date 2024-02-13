var testModulesRegex = '^__mocks__|^__tests__|^__testUtils__|^testUtils';
var localModulesRegex =
  '^assets|^libs|^clients|^components|^config|^constants|^containers|^context|^errors|^hooks|^pages|^stories|^theme|^translation|^types|^utilities';

module.exports = {
  ...require('prettier-airbnb-config'),
  trailingComma: 'all',
  bracketSpacing: true,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cn', 'twMerge'],
  importOrder: [
    `${testModulesRegex}|(${testModulesRegex})/(.*)$`,
    `${localModulesRegex}|(${localModulesRegex})/(.*)$`,
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
