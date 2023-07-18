import { BscChainId, Environment } from 'types';

export const API_ENDPOINT_URLS: Record<Environment, string> = {
  mainnet: 'https://api.venus.io/api',
  preview: 'https://api-preview.venus.io/api',
  testnet: 'https://testnetapi.venus.io/api',
  storybook: 'https://testnetapi.venus.io/api',
  ci: 'https://testnetapi.venus.io/api',
};

export const RPC_URLS: {
  [key: string]: string[];
} = {
  [BscChainId.MAINNET]: ['https://bsc-mainnet.nodereal.io/v1/7fab7575d1c34150a9ee582167ffac6f'],
  [BscChainId.TESTNET]: ['https://bsc-testnet.nodereal.io/v1/04acd8dedec141a4bb72313f7a54fe3c'],
};
