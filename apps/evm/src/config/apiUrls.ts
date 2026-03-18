import type { Network } from 'types';

export const apiHosts: {
  [key in Network]: string;
} = {
  testnet: 'testnetapi.venus.io',
  mainnet: 'api.venus.io',
  'mainnet-preview': 'api-preview.venus.io',
};
