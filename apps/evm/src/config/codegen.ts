/** @type {import('graphql-config').IGraphQLConfig } */

const plugins = ['typescript', 'typed-document-node', 'typescript-operations'];

export const projects = {
  isolatedPools: {
    schema: 'https://api.studio.thegraph.com/query/77761/venus-isolated-pools/version/latest',
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
  governanceBsc: {
    schema: 'https://api.studio.thegraph.com/query/77761/venus-governance/version/latest',
    documents: ['../clients/subgraph/queries/governanceBsc/**/*.graphql'],
    extensions: {
      codegen: {
        generates: {
          '../clients/subgraph/gql/generated/governanceBsc.ts': {
            plugins,
          },
        },
      },
    },
  },
  governanceRemoteChains: {
    schema: 'https://api.studio.thegraph.com/query/77761/venus-governance-ethereum/version/latest',
    documents: ['../clients/subgraph/queries/governanceRemoteChains/**/*.graphql'],
    extensions: {
      codegen: {
        generates: {
          '../clients/subgraph/gql/generated/governanceRemoteChains.ts': {
            plugins,
          },
        },
      },
    },
  },
};
