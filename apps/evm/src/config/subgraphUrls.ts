import { ChainId } from '@venusprotocol/chains';

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
    [ChainId.BSC_TESTNET]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmPFMfJqPwxqGrBMtqdFbQn4MpEG4nFfHeHCZP6r2fuLfW`,
    [ChainId.OPBNB_MAINNET]: `https://open-platform-ap.nodereal.io/${nodeRealApiKey}/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-governance-opbnb`,
    [ChainId.OPBNB_TESTNET]: undefined,
    [ChainId.ETHEREUM]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmUXMrtcyqXtzgHVQ8VAtsUJMKuDr7gk9WhHUgertioVZY`,
    [ChainId.SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmPo6H4QPNH5VrdqWystjdJX5SYZF6Vtf5ZXuQXz9erer8`,
    [ChainId.ARBITRUM_ONE]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmfUtsb2bQvFnPhxTNYemvQB3qqKvm27rZRFwm2X6yajyh`,
    [ChainId.ARBITRUM_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmX687zoJ2yD818d2YZXPDTkskbZtUPmWEE5zDsQR1dkfm`,
    [ChainId.ZKSYNC_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmcdLyjbM4bLv8TEHuCcBgWrJc1nh4b6mhKSZnz2DMGAhU`,
    [ChainId.ZKSYNC_SEPOLIA]: undefined,
    [ChainId.OPTIMISM_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmdTVnzZrFhVn3Q158b3E2rNPFPmEEfyQwgN3im2GbCQLy`,
    [ChainId.OPTIMISM_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmPHh6imhdS5zP9CjN2JJCo35eAprbPWJZuBDbskJnsvvU`,
    [ChainId.BASE_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmaeyNEyxYYvkTRDcFNufWRg7Ki8mB5BAXCAZotkhwebLv`,
    [ChainId.BASE_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmcDDMGa9oTzCLWMeSWg6mwULWDao5Mypw9raofBaSTNqw`,
    [ChainId.UNICHAIN_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmSnLbgST88bbgj9imnw77dPd4HJ1gfhRhG9AMbqEwykUz`,
    [ChainId.UNICHAIN_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmTuUX9XKdwc9tJ9GwcbsSHAoY92D7smyNsLdEnQ6sjXc8`,
  };

  return subgraphUrls;
};
