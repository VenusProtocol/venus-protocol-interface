/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@venus-interface/eslint-config/base.js'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};
