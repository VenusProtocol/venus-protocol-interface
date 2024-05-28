import { request } from 'graphql-request';

import { IsolatedPoolParticipantsCountDocument } from 'clients/subgraph';
import { SUBGRAPH_URLS } from 'constants/subgraphUrls';
import type { ChainId } from 'types';

export interface GetIsolatedPoolParticipantsCountInput {
  chainId: ChainId;
}

export const getIsolatedPoolParticipantsCount = ({
  chainId,
}: GetIsolatedPoolParticipantsCountInput) =>
  SUBGRAPH_URLS.markets[chainId]
    ? request(SUBGRAPH_URLS.markets[chainId]!, IsolatedPoolParticipantsCountDocument)
    : undefined;
