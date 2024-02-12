/** @type {import('graphql-config').IGraphQLConfig } */

export const BSC_MAINNET_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools';

export const BSC_TESTNET_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel';

export const ETHEREUM_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-ethereum';

export const SEPOLIA_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-sepolia';

export const projects = {
  mainnet: {
    schema: BSC_MAINNET_SUBGRAPH_URL,
    documents: ['../clients/subgraph/**/*.graphql'],
    extensions: {
      codegen: {
        generates: {
          '../clients/subgraph/gql/mainnet.ts': {
            plugins: ['typescript', 'typed-document-node', 'typescript-operations'],
          },
        },
      },
    },
  },
  testnet: {
    schema: BSC_TESTNET_SUBGRAPH_URL,
    documents: ['../clients/subgraph/**/*.graphql'],
    extensions: {
      codegen: {
        generates: {
          '../clients/subgraph/gql/testnet.ts': {
            plugins: ['typescript', 'typed-document-node', 'typescript-operations'],
          },
        },
      },
    },
  },
};
