import type { Network } from 'types';

export const apiUrls: Record<Network, string> = {
  testnet: 'https://testnetapi.venus.io',
  mainnet: 'https://api.venus.io',
  'mainnet-preview': 'https://api-preview.venus.io',
};
