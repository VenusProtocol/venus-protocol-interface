import { CodegenConfig } from '@graphql-codegen/cli';

const codegenConfig: CodegenConfig = {
  schema: import.meta.env.SUBGRAPH_GRAPHQL_ENDPOINT,
  documents: ['src/clients/subgraph/**/*.graphql'],
  generates: {
    './src/clients/subgraph/gql/queries.ts': {
      plugins: [
        {
          add: {
            placement: 'append',
            content: `export const subgraphEndpoint = '${
              import.meta.env.SUBGRAPH_GRAPHQL_ENDPOINT
            }';`,
          },
        },
        'typescript',
        'typed-document-node',
        'typescript-operations',
      ],
    },
  },
};

export default codegenConfig;
