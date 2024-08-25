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
  governance: {
    schema: 'https://api.studio.thegraph.com/query/77761/venus-governance/version/latest',
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
