/** @type {import('graphql-config').IGraphQLConfig } */

export const MAINNET_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools';

export const TESTNET_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools-chapel';

export const projects = {
  mainnet: {
    schema: MAINNET_SUBGRAPH_URL,
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
    schema: TESTNET_SUBGRAPH_URL,
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
