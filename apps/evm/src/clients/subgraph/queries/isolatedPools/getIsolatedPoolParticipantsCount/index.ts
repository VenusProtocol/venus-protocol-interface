import { request } from 'graphql-request';

import { IsolatedPoolParticipantsCountDocument } from 'clients/subgraph/gql/generated/isolatedPools';
import config from 'config';
import type { ChainId } from 'types';

export interface GetIsolatedPoolParticipantsCountInput {
  chainId: ChainId;
}

export const getIsolatedPoolParticipantsCount = ({
  chainId,
}: GetIsolatedPoolParticipantsCountInput) =>
  config.marketsSubgraphUrls[chainId]
    ? request(config.marketsSubgraphUrls[chainId], IsolatedPoolParticipantsCountDocument)
    : undefined;
