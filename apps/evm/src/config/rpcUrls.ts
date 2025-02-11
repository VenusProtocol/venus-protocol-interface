import { ChainId } from '@venusprotocol/chains/types';

import { envVariables } from './envVariables';

export const rpcUrls: {
  [chainId in ChainId]: string;
} = {
  [ChainId.BSC_MAINNET]: `https://bsc-mainnet.nodereal.io/v1/${envVariables.VITE_NODE_REAL_API_KEY}`,
  [ChainId.BSC_TESTNET]: `https://bsc-testnet.nodereal.io/v1/${envVariables.VITE_NODE_REAL_API_KEY}`,
  [ChainId.OPBNB_MAINNET]: `https://opbnb-mainnet.nodereal.io/v1/${envVariables.VITE_NODE_REAL_API_KEY}`,
  [ChainId.OPBNB_TESTNET]: `https://opbnb-testnet.nodereal.io/v1/${envVariables.VITE_NODE_REAL_API_KEY}`,
  [ChainId.ETHEREUM]: `https://eth-mainnet.nodereal.io/v1/${envVariables.VITE_NODE_REAL_API_KEY}`,
  [ChainId.SEPOLIA]: `https://eth-sepolia.nodereal.io/v1/${envVariables.VITE_NODE_REAL_API_KEY}`,
  [ChainId.ARBITRUM_ONE]: `https://open-platform.nodereal.io/${envVariables.VITE_NODE_REAL_API_KEY}/arbitrum-nitro`,
  [ChainId.ARBITRUM_SEPOLIA]:
    'https://rpc.ankr.com/arbitrum_sepolia/451c00a15d3de617618d7a880cec1da8065b10906c460b1462a8b8769d91e0da',
  [ChainId.ZKSYNC_MAINNET]: `https://open-platform.nodereal.io/${envVariables.VITE_NODE_REAL_API_KEY}/zksync`,
  [ChainId.ZKSYNC_SEPOLIA]: 'https://sepolia.era.zksync.dev',
  [ChainId.OPTIMISM_MAINNET]: `https://opt-mainnet.nodereal.io/v1/${envVariables.VITE_NODE_REAL_API_KEY}`,
  [ChainId.OPTIMISM_SEPOLIA]: 'https://sepolia.optimism.io',
  [ChainId.BASE_MAINNET]: `https://open-platform.nodereal.io/${envVariables.VITE_NODE_REAL_API_KEY}/base`,
  [ChainId.BASE_SEPOLIA]: 'https://sepolia.base.org',
  [ChainId.UNICHAIN_MAINNET]: `https://unichain-mainnet.g.alchemy.com/v2/${envVariables.VITE_ALCHEMY_API_KEY}`,
  [ChainId.UNICHAIN_SEPOLIA]: `https://unichain-sepolia.g.alchemy.com/v2/${envVariables.VITE_ALCHEMY_API_KEY}`,
};
