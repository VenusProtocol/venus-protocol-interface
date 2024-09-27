import { request } from 'graphql-request';

import type { ChainId } from '@venusprotocol/chains';
import { IsolatedPoolParticipantsCountDocument } from 'clients/subgraph';
import config from 'config';

export interface GetIsolatedPoolParticipantsCountInput {
  chainId: ChainId;
}

export const getIsolatedPoolParticipantsCount = ({
  chainId,
}: GetIsolatedPoolParticipantsCountInput) =>
  config.subgraphUrls[chainId]?.markets
    ? request(config.subgraphUrls[chainId]?.markets!, IsolatedPoolParticipantsCountDocument)
    : undefined;
