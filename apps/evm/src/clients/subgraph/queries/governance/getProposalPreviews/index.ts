import { request } from 'graphql-request';

import { ProposalPreviewsDocument, type ProposalPreviewsQueryVariables } from 'clients/subgraph';
import config from 'config';
import type { ChainId } from 'types';

export interface GetProposalPreviewsInput {
  chainId: ChainId;
  variables: ProposalPreviewsQueryVariables;
}

export const getProposalPreviews = ({ chainId, variables }: GetProposalPreviewsInput) =>
  config.governanceSubgraphUrls[chainId]
    ? request({
        url: config.governanceSubgraphUrls[chainId],
        variables,
        document: ProposalPreviewsDocument,
      })
    : undefined;
