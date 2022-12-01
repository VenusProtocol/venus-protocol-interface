import { BscChainId } from 'types';

export const API_ENDPOINT_URLS = {
  [BscChainId.MAINNET]: 'https://api.venus.io/api',
  [BscChainId.TESTNET]: 'https://testnetapi.venus.io/api',
};

export const SUBGRAPH_ENDPOINT_URLS = {
  [BscChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-subgraph',
  [BscChainId.TESTNET]:
    'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel',
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
