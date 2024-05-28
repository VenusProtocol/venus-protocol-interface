import { ChainId } from 'types';

export const SUBGRAPH_URLS: {
  markets: Partial<{ [chainId in ChainId]: string }>;
  governance: Partial<{ [chainId in ChainId]: string }>;
} = {
  markets: {
    [ChainId.BSC_MAINNET]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools?source=venusprotocol-ui',
    [ChainId.BSC_TESTNET]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel?source=venusprotocol-ui',
    [ChainId.OPBNB_MAINNET]:
      'https://open-platform-ap.nodereal.io/5c42a03458b64b33af7cf9ff0c70c088/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-isolated-pools-opbnb',
    [ChainId.ETHEREUM]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-ethereum?source=venusprotocol-ui',
    [ChainId.SEPOLIA]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-sepolia?source=venusprotocol-ui',
  },
  governance: {
    [ChainId.BSC_MAINNET]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-governance?source=venusprotocol-ui',
    [ChainId.BSC_TESTNET]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-governance-chapel?source=venusprotocol-ui',
  },
};
