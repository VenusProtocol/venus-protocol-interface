import { ChainId } from 'types';

export const SUBGRAPH_URlS: {
  markets: Partial<{ [chainId in ChainId]: string }>;
  governance: Partial<{ [chainId in ChainId]: string }>;
} = {
  markets: {
    [ChainId.BSC_MAINNET]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools',
    [ChainId.BSC_TESTNET]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel',
    [ChainId.OPBNB_MAINNET]:
      'https://open-platform-ap.nodereal.io/5c42a03458b64b33af7cf9ff0c70c088/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-isolated-pools-opbnb',
    [ChainId.ETHEREUM]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-ethereum',
    [ChainId.SEPOLIA]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-sepolia',
  },
  governance: {
    [ChainId.BSC_MAINNET]: 'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-governance',
    [ChainId.BSC_TESTNET]:
      'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-governance-chapel',
  },
};
