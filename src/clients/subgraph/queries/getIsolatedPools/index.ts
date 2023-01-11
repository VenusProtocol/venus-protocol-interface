import { request } from 'graphql-request';

import { IsolatedPoolsDocument, subgraphEndpoint } from 'clients/subgraph/gql/queries';

export const getIsolatedPools = () => request(subgraphEndpoint, IsolatedPoolsDocument);
