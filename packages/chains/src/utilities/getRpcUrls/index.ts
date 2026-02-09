import { ChainId } from '../../types';

export const getRpcUrls = ({
  nodeRealApiKey,
  alchemyApiKey,
}: {
  nodeRealApiKey: string;
  alchemyApiKey: string;
}): { [chainId in ChainId]: string[] } => {
  const rpcUrls: {
    [chainId in ChainId]: string[];
  } = {
    [ChainId.BSC_MAINNET]: [
      `https://bsc-mainnet.nodereal.io/v1/${nodeRealApiKey}`,
      `https://bnb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ],
    [ChainId.BSC_TESTNET]: [`https://bsc-testnet.nodereal.io/v1/${nodeRealApiKey}`],
    [ChainId.OPBNB_MAINNET]: [
      `https://opbnb-mainnet.nodereal.io/v1/${nodeRealApiKey}`,
      `https://opbnb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ],
    [ChainId.OPBNB_TESTNET]: [
      `https://opbnb-testnet.g.alchemy.com/v2/${alchemyApiKey}`,
      `https://opbnb-testnet.nodereal.io/v1/${nodeRealApiKey}`,
    ],
    [ChainId.ETHEREUM]: [
      `https://eth-mainnet.nodereal.io/v1/${nodeRealApiKey}`,
      `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ],
    [ChainId.SEPOLIA]: [`https://eth-sepolia.nodereal.io/v1/${nodeRealApiKey}`],
    [ChainId.ARBITRUM_ONE]: [
      `https://open-platform.nodereal.io/${nodeRealApiKey}/arbitrum-nitro`,
      `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ],
    [ChainId.ARBITRUM_SEPOLIA]: [
      'https://rpc.ankr.com/arbitrum_sepolia/451c00a15d3de617618d7a880cec1da8065b10906c460b1462a8b8769d91e0da',
    ],
    [ChainId.ZKSYNC_MAINNET]: [
      `https://open-platform.nodereal.io/${nodeRealApiKey}/zksync`,
      `https://zksync-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    ],
    [ChainId.ZKSYNC_SEPOLIA]: ['https://sepolia.era.zksync.dev'],
    [ChainId.OPTIMISM_MAINNET]: [
      `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      `https://opt-mainnet.nodereal.io/v1/${nodeRealApiKey}`,
    ],
    [ChainId.OPTIMISM_SEPOLIA]: [
      `https://opt-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
      'https://sepolia.optimism.io',
    ],
    [ChainId.BASE_MAINNET]: [
      `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      `https://open-platform.nodereal.io/${nodeRealApiKey}/base`,
    ],
    [ChainId.BASE_SEPOLIA]: [
      `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
      'https://sepolia.base.org',
    ],
    [ChainId.UNICHAIN_MAINNET]: [`https://unichain-mainnet.g.alchemy.com/v2/${alchemyApiKey}`],
    [ChainId.UNICHAIN_SEPOLIA]: [`https://unichain-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
  };

  return rpcUrls;
};
