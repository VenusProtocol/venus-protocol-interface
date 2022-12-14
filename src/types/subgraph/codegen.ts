import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.SUBGRAPH_GRAPHQL_ENDPOINT,
  documents: ['src/clients/subgraph/**/*.graphql'],
  generates: {
    './src/types/subgraph/gql/queries.ts': {
      plugins: [
        {
          add: {
            placement: 'append',
            content: `export const subgraphEndpoint = '${process.env.SUBGRAPH_GRAPHQL_ENDPOINT}';`,
          },
        },
        'typescript',
        'typed-document-node',
        'typescript-operations',
      ],
    },
  },
};

export default config;
