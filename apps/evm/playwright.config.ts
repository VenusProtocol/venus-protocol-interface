import { defineConfig, devices } from '@playwright/test';

const appPort = Number(process.env.PLAYWRIGHT_APP_PORT ?? 5173);
const storybookPort = Number(process.env.PLAYWRIGHT_STORYBOOK_PORT ?? 6006);
const target = process.env.PLAYWRIGHT_TARGET ?? 'app';
const isStorybookTarget = target === 'storybook';
const appBaseUrl = `http://127.0.0.1:${appPort}`;
const storybookBaseUrl = `http://127.0.0.1:${storybookPort}`;

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? (isStorybookTarget ? storybookBaseUrl : appBaseUrl);

const shouldStartWebServer =
  !process.env.PLAYWRIGHT_BASE_URL && process.env.PLAYWRIGHT_SKIP_SERVER !== '1';

const webServer = shouldStartWebServer
  ? {
      command: isStorybookTarget
        ? `yarn storybook --ci --host 127.0.0.1 --port ${storybookPort} --no-open`
        : `yarn start --host 127.0.0.1 --port ${appPort}`,
      env: {
        VITE_ENV: process.env.VITE_ENV ?? 'ci',
        VITE_NETWORK: process.env.VITE_NETWORK ?? 'testnet',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: baseURL,
    }
  : undefined;

export default defineConfig({
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.005,
      threshold: 0.1,
    },
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { height: 900, width: 1280 },
      },
    },
    {
      name: 'mobile-chromium',
      use: devices['Pixel 5'],
    },
  ],
  reporter: 'html',
  testDir: './playwright',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer,
});
