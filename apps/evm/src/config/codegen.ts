/** @type {import('graphql-config').IGraphQLConfig } */

const plugins = ['typescript', 'typed-document-node', 'typescript-operations'];

export const projects = {
  isolatedPools: {
    schema: 'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-isolated-pools',
    documents: ['../clients/subgraph/queries/isolatedPools/**/*.graphql'],
    extensions: {
      codegen: {
        generates: {
          '../clients/subgraph/gql/generated/isolatedPools.ts': {
            plugins,
          },
        },
      },
    },
  },
  governance: {
    schema: 'https://api.thegraph.com/subgraphs/name/venusprotocol/venus-governance',
    documents: ['../clients/subgraph/queries/governance/**/*.graphql'],
    extensions: {
      codegen: {
        generates: {
          '../clients/subgraph/gql/generated/governance.ts': {
            plugins,
          },
        },
      },
    },
  },
};
