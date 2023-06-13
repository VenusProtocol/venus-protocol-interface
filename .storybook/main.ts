import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    !!import.meta.env.IS_CI_ENV
      ? // Only build root page stories when running on CI pipeline
        '../src/pages/*/*.stories.@(js|jsx|ts|tsx)'
      : '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  env: config => ({
    ...config,
    // Always run Storybook in test environment
    VITE_ENVIRONMENT: 'testnet',
  }),
};
export default config;
