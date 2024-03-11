/** @type {import('graphql-config').IGraphQLConfig } */

export const BSC_MAINNET_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools';

export const BSC_TESTNET_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel';

export const OPBNB_MAINNET_SUBGRAPH_URL =
  'https://open-platform-ap.nodereal.io/5c42a03458b64b33af7cf9ff0c70c088/opbnb-mainnet-graph-query/subgraphs/name/venusprotocol/venus-isolated-pools-opbnb';

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
          '../clients/subgraph/gql/generated/mainnet.ts': {
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
          '../clients/subgraph/gql/generated/testnet.ts': {
            plugins: ['typescript', 'typed-document-node', 'typescript-operations'],
          },
        },
      },
    },
  },
};
