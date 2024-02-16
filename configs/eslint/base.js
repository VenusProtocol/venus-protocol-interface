module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['import', 'react', 'jsx-a11y', 'prettier', 'unused-imports'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['node_modules', '.eslintrc.js'],
  rules: {
    // handled by prettier
    '@typescript-eslint/space-before-blocks': 0,
    '@typescript-eslint/indent': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'no-confusing-arrow': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-indent': 0,
    /* airbnb rules */
    'implicit-arrow-linebreak': 0,
    'import/prefer-default-export': 0,
    'function-paren-newline': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'max-len': [
      0,
      {
        code: 100,
        ignoreComments: true,
      },
    ],
    'no-param-reassign': 0,
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'operator-linebreak': 0,
    'react/prop-types': 0,
    'react/default-props-match-prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react/prefer-stateless-function': 0,
    'react/require-default-props': 0,

    // Custom
    'import/no-named-as-default': 0,
    'import/export': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/jsx-wrap-multilines': 0,
    'generator-star-spacing': 0,
    'consistent-return': 0,
    // Disable import order checks as we automatically sort imports using Prettier
    'import/order': 0,
    // Disable requirement to import React when rendering JSX (no longer needed since React 17)
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
