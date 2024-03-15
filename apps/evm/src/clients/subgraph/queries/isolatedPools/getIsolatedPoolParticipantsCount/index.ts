import { request } from 'graphql-request';

import { IsolatedPoolParticipantsCountDocument } from 'clients/subgraph/gql';
import { SUBGRAPH_URlS } from 'constants/subgraphUrls';
import type { ChainId } from 'types';

export interface GetIsolatedPoolParticipantsCountInput {
  chainId: ChainId;
}

export const getIsolatedPoolParticipantsCount = ({
  chainId,
}: GetIsolatedPoolParticipantsCountInput) =>
  SUBGRAPH_URlS.markets[chainId]
    ? request(SUBGRAPH_URlS.markets[chainId]!, IsolatedPoolParticipantsCountDocument)
    : undefined;
