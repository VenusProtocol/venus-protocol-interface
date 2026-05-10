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
    [ChainId.BSC_MAINNET]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmQhWQE1AvpLUaRZj2EprFw1GdpLkrXomuoTFmJFE18B23`,
    [ChainId.BSC_TESTNET]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmPFMfJqPwxqGrBMtqdFbQn4MpEG4nFfHeHCZP6r2fuLfW`,
    [ChainId.OPBNB_MAINNET]: `https://open-platform-ap.nodereal.io/${nodeRealApiKey}/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-governance-opbnb`,
    [ChainId.OPBNB_TESTNET]: undefined,
    [ChainId.ETHEREUM]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmZcQL8dG5bSyvwr9xsa19ipJuAVZTtDLpe66cGvunxgY4`,
    [ChainId.SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmPo6H4QPNH5VrdqWystjdJX5SYZF6Vtf5ZXuQXz9erer8`,
    [ChainId.ARBITRUM_ONE]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmS2vrsRcJjXgvy6dBFbZSa6DDaJJbNdXDNsXVrSgYJi14`,
    [ChainId.ARBITRUM_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmX687zoJ2yD818d2YZXPDTkskbZtUPmWEE5zDsQR1dkfm`,
    [ChainId.ZKSYNC_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmbnJ3hCaLnWow5HxHah7EJPUZwTB9DK7SseKRsmfnjkjp`,
    [ChainId.ZKSYNC_SEPOLIA]: undefined,
    [ChainId.OPTIMISM_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmQzJJ3gmdYy8rtkLaxTdZBiYZEXt6WgWKqKqkjCpNXxRM`,
    [ChainId.OPTIMISM_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmPHh6imhdS5zP9CjN2JJCo35eAprbPWJZuBDbskJnsvvU`,
    [ChainId.BASE_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmRNaEtVc4BguM3Keyse9AqPGrnTSqxdyVfATZNkmnFykE`,
    [ChainId.BASE_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmcDDMGa9oTzCLWMeSWg6mwULWDao5Mypw9raofBaSTNqw`,
    [ChainId.UNICHAIN_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/deployments/id/QmSnLbgST88bbgj9imnw77dPd4HJ1gfhRhG9AMbqEwykUz`,
    [ChainId.UNICHAIN_SEPOLIA]: `https://gateway-arbitrum.network.thegraph.com/api/${theGraphApiKey}/deployments/id/QmTuUX9XKdwc9tJ9GwcbsSHAoY92D7smyNsLdEnQ6sjXc8`,
  };

  return subgraphUrls;
};
