module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react', 'jsx-a11y', 'prettier'],
  extends: ['airbnb-typescript', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/naming-convention': 0,
    'prefer-const': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    // handled by prettier
    '@typescript-eslint/indent': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
