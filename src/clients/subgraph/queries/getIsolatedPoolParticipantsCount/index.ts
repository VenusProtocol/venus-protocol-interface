import { request } from 'graphql-request';

import gql from 'clients/subgraph/gql';
import config from 'config';
import { ChainId } from 'types';

export interface GetIsolatedPoolParticipantsCountInput {
  chainId: ChainId;
}

export const getIsolatedPoolParticipantsCount = ({
  chainId,
}: GetIsolatedPoolParticipantsCountInput) => {
  const subgraphUrl = config.subgraphUrls[chainId];
  if (subgraphUrl) {
    return request(subgraphUrl, gql.IsolatedPoolParticipantsCountDocument);
  }
  return undefined;
};
