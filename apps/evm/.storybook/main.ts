import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    process.env.IS_CI_ENV
      ? // Only build root page stories when running on CI pipeline
        '../src/pages/*/*.stories.@(js|jsx|ts|tsx)'
      : '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  docs: {},
  env: config => ({
    ...config,
    // Always run Storybook in test environment
    VITE_ENV: 'storybook',
    VITE_NETWORK: 'testnet',
  }),
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
