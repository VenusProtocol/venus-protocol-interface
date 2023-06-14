module.exports = {
  stories: [
    !!process.env.IS_CI_ENV
      ? // Only build root page stories when running on CI pipeline
        '../src/pages/*/*.stories.@(js|jsx|ts|tsx)'
      : '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  env: config => ({
    ...config,
    // Always run Storybook in test environment
    VITE_CHAIN_ID: 97,
  }),
};
