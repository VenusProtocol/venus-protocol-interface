import { request } from 'graphql-request';

import { AssetsInAccountQueryDocument, subgraphEndpoint } from 'clients/subgraph/gql/queries';

export const getAssetsInAccount = (accountAddress: string) =>
  request(subgraphEndpoint, AssetsInAccountQueryDocument, { accountAddress });
