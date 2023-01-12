import { request } from 'graphql-request';

import { IsolatedPoolsDocument, subgraphEndpoint } from 'clients/subgraph/gql/queries';

export interface GetIsolatedPoolsInput {
  accountAddress?: string;
}

export const getIsolatedPools = (input: GetIsolatedPoolsInput) =>
  request(subgraphEndpoint, IsolatedPoolsDocument, input);
