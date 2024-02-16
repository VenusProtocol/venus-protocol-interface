/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@venusprotocol/eslint-config/base.js'],
  ignorePatterns: ['node_modules', '.eslintrc.js', 'generated'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__mocks__/**',
          '**/scripts/**',
          '**/generated/**',
          '**/*.spec.tsx',
          '**/*.spec.ts',
        ],
      },
    ],
  },
};
