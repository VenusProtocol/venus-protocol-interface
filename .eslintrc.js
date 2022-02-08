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
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/naming-convention': 0,
    'prefer-const': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,

    /* airbnb rules */
    'implicit-arrow-linebreak': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'max-len': [0,
      {
        code: 100,
        ignoreComments: true,
      },
    ],
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'operator-linebreak': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 1,
    'react/jsx-no-target-blank': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-array-index-key': 0,
    'react/no-unused-prop-types': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
