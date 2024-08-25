import { request } from 'graphql-request';

import { IsolatedPoolParticipantsCountDocument } from 'clients/subgraph';
import config from 'config';
import type { ChainId } from 'types';

export interface GetIsolatedPoolParticipantsCountInput {
  chainId: ChainId;
}

export const getIsolatedPoolParticipantsCount = ({
  chainId,
}: GetIsolatedPoolParticipantsCountInput) =>
  config.subgraphUrls[chainId]?.markets
    ? request(config.subgraphUrls[chainId]?.markets!, IsolatedPoolParticipantsCountDocument)
    : undefined;
