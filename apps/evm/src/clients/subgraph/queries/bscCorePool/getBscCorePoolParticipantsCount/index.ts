import { request } from 'graphql-request';

import { BscCorePoolParticipantsCountDocument } from 'clients/subgraph/gql/generated/bscCorePool';
import config from 'config';
import type { ChainId } from 'types';

export interface GetBscCorePoolParticipantsCountInput {
  chainId: ChainId.BSC_MAINNET | ChainId.BSC_TESTNET;
}

export const getBscCorePoolParticipantsCount = ({
  chainId,
}: GetBscCorePoolParticipantsCountInput) =>
  config.bscCorePoolSubgraphUrls[chainId]
    ? request(config.bscCorePoolSubgraphUrls[chainId], BscCorePoolParticipantsCountDocument)
    : undefined;
