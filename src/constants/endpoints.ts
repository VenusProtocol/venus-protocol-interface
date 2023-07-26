import { ChainId } from 'packages/contracts';
import { Environment } from 'types';

export const API_ENDPOINT_URLS: Record<Environment, string> = {
  mainnet: 'https://api.venus.io',
  preview: 'https://api-preview.venus.io',
  testnet: 'https://testnetapi.venus.io',
  storybook: 'https://testnetapi.venus.io',
  ci: 'https://testnetapi.venus.io',
};

export const RPC_URLS: {
  [key: string]: string;
} = {
  [ChainId.BSC_MAINNET]: 'https://bsc-mainnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
  [ChainId.BSC_TESTNET]: 'https://bsc-testnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f',
};
