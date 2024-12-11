/** @type {import('graphql-config').IGraphQLConfig } */

import { ChainId } from '@venusprotocol/chains/types';

import { envVariables } from './src/config/envVariables';
import { getGovernanceSubgraphUrls, getIsolatedPoolsSubgraphUrls } from './src/config/subgraphUrls';

const keys = {
  nodeRealApiKey: envVariables.VITE_NODE_REAL_API_KEY,
  theGraphApiKey: envVariables.VITE_THE_GRAPH_API_KEY,
};

const isolatedPoolsSubgraphUrls = getIsolatedPoolsSubgraphUrls(keys);
const governanceSubgraphUrls = getGovernanceSubgraphUrls(keys);

const plugins = ['typescript', 'typed-document-node', 'typescript-operations'];

export const projects = {
  isolatedPools: {
    schema: isolatedPoolsSubgraphUrls[ChainId.BSC_MAINNET],
    documents: ['./src/clients/subgraph/queries/isolatedPools/**/*.graphql'],
    errorsOnly: true,
    extensions: {
      codegen: {
        generates: {
          './src/clients/subgraph/gql/generated/isolatedPools.ts': {
            plugins,
          },
        },
      },
    },
  },
  governanceBsc: {
    schema: governanceSubgraphUrls[ChainId.BSC_MAINNET],
    documents: ['./src/clients/subgraph/queries/governanceBsc/**/*.graphql'],
    errorsOnly: true,
    extensions: {
      codegen: {
        generates: {
          './src/clients/subgraph/gql/generated/governanceBsc.ts': {
            plugins,
          },
        },
      },
    },
  },
  governanceNonBsc: {
    schema: governanceSubgraphUrls[ChainId.ETHEREUM],
    documents: ['./src/clients/subgraph/queries/governanceNonBsc/**/*.graphql'],
    errorsOnly: true,
    extensions: {
      codegen: {
        generates: {
          './src/clients/subgraph/gql/generated/governanceNonBsc.ts': {
            plugins,
          },
        },
      },
    },
  },
};
