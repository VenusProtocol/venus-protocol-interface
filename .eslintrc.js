module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react', 'jsx-a11y', 'prettier', 'unused-imports'],
  extends: ['airbnb', 'airbnb-typescript', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'unused-imports/no-unused-imports': 2,
    'unused-imports/no-unused-vars': 2,
    // handled by prettier
    '@typescript-eslint/space-before-blocks': 0,
    '@typescript-eslint/indent': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'no-confusing-arrow': 0,
    'react/jsx-one-expression-per-line': 0,

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
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'operator-linebreak': 0,
    'react/prop-types': 0,
    'react/default-props-match-prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react/prefer-stateless-function': 0,
    'react/require-default-props': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.stories.tsx', '**/*.stories.ts', 'src/stories/**'],
      },
    ],
    // Custom
    'import/no-named-as-default': 0,
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
    'react/jsx-wrap-multilines': 0,
    'generator-star-spacing': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
