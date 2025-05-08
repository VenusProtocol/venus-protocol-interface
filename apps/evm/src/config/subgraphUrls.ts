import { ChainId } from '@venusprotocol/chains/types';

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
    [ChainId.BSC_MAINNET]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmRNDurj3yDRfmdf89Bv9MZASSr1fTSu9hdp3CgLTRY8rg`,
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
    [ChainId.BASE_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmaeyNEyxYYvkTRDcFNufWRg7Ki8mB5BAXCAZotkhwebLv`,
    [ChainId.BASE_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-governance-base-sepolia/version/latest',
    [ChainId.UNICHAIN_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmSnLbgST88bbgj9imnw77dPd4HJ1gfhRhG9AMbqEwykUz`,
    [ChainId.UNICHAIN_SEPOLIA]:
      'https://api.studio.thegraph.com/query/64786/venus-governance-unichain-sepolia/version/latest',
    [ChainId.BERACHAIN_MAINNET]: '', // TODO: add once deployed
    [ChainId.BERACHAIN_BEPOLIA]: '', // TODO: add once deployed
  };

  return subgraphUrls;
};
