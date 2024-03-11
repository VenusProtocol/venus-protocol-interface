import type { Environment } from 'types';

export const API_ENDPOINT_URLS: Record<Environment, string> = {
  mainnet: 'https://api.venus.io',
  preview: 'https://api-preview.venus.io',
  testnet: 'https://testnetapi.venus.io',
  storybook: 'https://testnetapi.venus.io',
  ci: 'https://testnetapi.venus.io',
};
