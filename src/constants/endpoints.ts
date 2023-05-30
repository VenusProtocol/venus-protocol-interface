import { BscChainId, Environment } from 'types';

export const API_ENDPOINT_URLS: Record<Environment, string> = {
  mainnet: 'https://api.venus.io/api',
  preview: 'https://api-preview.venus.io/api',
  testnet: 'https://testnetapi.venus.io/api',
};

export const RPC_URLS: {
  [key: string]: string[];
} = {
  [BscChainId.MAINNET]: [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org',
  ],
  [BscChainId.TESTNET]: ['https://bsc-testnet.nodereal.io/v1/f9777f42cc9243f0a766937df1c6a5f3'],
};
