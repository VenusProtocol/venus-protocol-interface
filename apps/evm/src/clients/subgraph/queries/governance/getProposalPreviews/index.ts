import { request } from 'graphql-request';

import { ProposalPreviewsDocument, type ProposalPreviewsQueryVariables } from 'clients/subgraph';
import { SUBGRAPH_URlS } from 'constants/subgraphUrls';
import type { ChainId } from 'types';

export interface GetProposalPreviewsInput {
  chainId: ChainId;
  variables: ProposalPreviewsQueryVariables;
}

export const getProposalPreviews = ({ chainId, variables }: GetProposalPreviewsInput) =>
  SUBGRAPH_URlS.governance[chainId]
    ? request({
        url: SUBGRAPH_URlS.governance[chainId]!,
        variables,
        document: ProposalPreviewsDocument,
      })
    : undefined;
