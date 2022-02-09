module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react', 'jsx-a11y', 'prettier'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    // handled by prettier
    '@typescript-eslint/indent': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'no-confusing-arrow': 0,
    'implicit-arrow-linebreak': 0,
    'max-len': [0,
      {
        code: 100,
        ignoreComments: true,
      },
    ],
    'operator-linebreak': 0,

    'import/prefer-default-export': 0,
    /* airbnb rules */
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'react/default-props-match-prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/no-array-index-key': 0,
    'react/no-unused-prop-types': 0,
    'react/prefer-stateless-function': 0,
    'react/require-default-props': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
