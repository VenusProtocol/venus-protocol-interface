/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@venusprotocol/eslint-config/base.js'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__mocks__/**',
          '**/*.spec.tsx',
          '**/*.spec.ts',
          '**/*.stories.tsx',
          '**/*.stories.ts',
          '**/*/setupTests.tsx',
          '**/*/stories/**',
          '**/*/testUtils/**',
        ],
      },
    ],
  },
  ignorePatterns: [
    'node_modules/',
    'public/',
    'build/',
    'storybook-static/',
    'coverage/',
    'scripts/',
    '.eslintrc.js',
    'i18next-parser.config.js',
    'vite.config.ts',
    'commitlint.config.js',
    'src/clients/subgraph/gql',
    'mainnetPancakeSwapTokens.ts',
  ],
};
