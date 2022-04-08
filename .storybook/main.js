module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  env: config => ({
    ...config,
    // Always run Storybook in test environment
    REACT_APP_CHAIN_ID: 97,
  }),
};
