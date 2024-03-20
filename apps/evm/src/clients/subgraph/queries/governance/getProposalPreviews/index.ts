import { request } from 'graphql-request';

import { ProposalPreviewsDocument } from 'clients/subgraph';
import { SUBGRAPH_URlS } from 'constants/subgraphUrls';
import type { ChainId } from 'types';

export interface GetProposalPreviewsInput {
  chainId: ChainId;
  page: number;
  limit: number;
  accountAddress?: string;
}

export const getProposalPreviews = ({
  chainId,
  page,
  limit,
  accountAddress,
}: GetProposalPreviewsInput) =>
  SUBGRAPH_URlS.governance[chainId]
    ? request({
        url: SUBGRAPH_URlS.governance[chainId]!,
        variables: {
          skip: page * limit,
          limit,
          accountAddress: accountAddress?.toLocaleLowerCase() ?? '',
        },
        document: ProposalPreviewsDocument,
      })
    : undefined;
