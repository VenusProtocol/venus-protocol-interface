import { ChainId } from '@venusprotocol/chains/types';

export const getIsolatedPoolsSubgraphUrls = ({
  nodeRealApiKey,
  theGraphApiKey,
}: {
  nodeRealApiKey: string;
  theGraphApiKey: string;
}) => {
  const subgraphUrls: {
    [chainId in ChainId]: string | undefined;
  } = {
    [ChainId.BSC_MAINNET]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmVMKvBgAgnqVrLmRUurMiziH3Q55Fa5VoYJXN4TVLZgsw`,
    [ChainId.BSC_TESTNET]:
      'https://api.studio.thegraph.com/query/77761/venus-isolated-pools-chapel/version/latest',
    [ChainId.OPBNB_MAINNET]: `https://open-platform-ap.nodereal.io/${nodeRealApiKey}/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-isolated-pools-opbnb`,
    [ChainId.OPBNB_TESTNET]: undefined,
    [ChainId.ETHEREUM]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/Qmazi4kSKzahgR5G6U7FVUoUGLQZQVPohRX6zbuxbC8YX1`,
    [ChainId.SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-isolated-pools-sepolia/version/latest',
    [ChainId.ARBITRUM_ONE]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmQByQzsGpuVqaZcfraxQduUwMX4JpnAnFd1s1JTkSUREj`,
    [ChainId.ARBITRUM_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-il-arbitrumsepolia/version/latest',
    [ChainId.ZKSYNC_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/Qma87oPwwDfvsmBySPJQLsFKc8JXBQaJvS12MYGGku2bRG`,
    [ChainId.ZKSYNC_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-il-zksync-sepolia/version/latest',
    [ChainId.OPTIMISM_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmZqvM6BRz1nNvK41SbfcafW2sbLZpnDMmubpQ5phkmPD8`,
    [ChainId.OPTIMISM_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-il-optimism-sepolia/version/latest',
  };

  return subgraphUrls;
};

export const getGovernanceSubgraphUrls = ({
  nodeRealApiKey,
  theGraphApiKey,
}: {
  nodeRealApiKey: string;
  theGraphApiKey: string;
}) => {
  const subgraphUrls: {
    [chainId in ChainId]: string | undefined;
  } = {
    [ChainId.BSC_MAINNET]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmRCMZJjxi3oKCtbh5CY4gBT2E21Cbz65DAzmnKMNPNGLV`,
    [ChainId.BSC_TESTNET]:
      'https://api.studio.thegraph.com/query/64786/venus-governance-chapel/version/latest',
    [ChainId.OPBNB_MAINNET]: `https://open-platform-ap.nodereal.io/${nodeRealApiKey}/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-governance-opbnb`,
    [ChainId.OPBNB_TESTNET]: undefined,
    [ChainId.ETHEREUM]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmUXMrtcyqXtzgHVQ8VAtsUJMKuDr7gk9WhHUgertioVZY`,
    [ChainId.SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-governance-sepolia/version/latest',
    [ChainId.ARBITRUM_ONE]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmfUtsb2bQvFnPhxTNYemvQB3qqKvm27rZRFwm2X6yajyh`,
    [ChainId.ARBITRUM_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-governance-arbisepolia/version/latest',
    [ChainId.ZKSYNC_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmcdLyjbM4bLv8TEHuCcBgWrJc1nh4b6mhKSZnz2DMGAhU`,
    [ChainId.ZKSYNC_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-governance-zksyncsepolia/version/latest',
    [ChainId.OPTIMISM_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmdTVnzZrFhVn3Q158b3E2rNPFPmEEfyQwgN3im2GbCQLy`,
    [ChainId.OPTIMISM_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-governance-opsepolia/version/latest',
  };

  return subgraphUrls;
};
