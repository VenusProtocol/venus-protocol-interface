module.exports = {
    root: true,
    extends: 'stylelint-config-standard',
    plugins: [
      'stylelint-scss',
    ],
    rules: {
      'at-rule-empty-line-before': null,
      'at-rule-no-unknown': [true, {
        ignoreAtRules: ['function', 'if', 'else', 'return', 'each', 'include', 'mixin'],
      }],
      'block-closing-brace-newline-after': ['always', {
        ignoreAtRules: ['if', 'else'],
      }],
      'declaration-empty-line-before': null,
      'rule-empty-line-before': null,
      'selector-list-comma-newline-after': null,
    },
};