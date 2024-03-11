module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-scss'],
  customSyntax: '@stylelint/postcss-css-in-js',
  rules: {
    'at-rule-empty-line-before': null,
    'function-name-case': null,
    'selector-class-pattern': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['function', 'if', 'else', 'return', 'each', 'include', 'mixin'],
      },
    ],
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'selector-list-comma-newline-after': null,
    'no-descending-specificity': null,
  },
};
