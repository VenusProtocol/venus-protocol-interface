import { request } from 'graphql-request';

import { ProposalsDocument } from 'clients/subgraph/gql';
import { SUBGRAPH_URlS } from 'constants/subgraphUrls';
import type { ChainId } from 'types';

export interface GetProposalsInput {
  chainId: ChainId;
}

export const getProposals = ({ chainId }: GetProposalsInput) =>
  SUBGRAPH_URlS.governance[chainId]
    ? request(SUBGRAPH_URlS.governance[chainId]!, ProposalsDocument)
    : undefined;
