import { request } from 'graphql-request';

import { ProposalPreviewsDocument, type ProposalPreviewsQueryVariables } from 'clients/subgraph';
import config from 'config';
import type { ChainId } from 'types';

export interface GetProposalPreviewsInput {
  chainId: ChainId;
  variables: ProposalPreviewsQueryVariables;
}

export const getProposalPreviews = ({ chainId, variables }: GetProposalPreviewsInput) =>
  config.subgraphUrls[chainId]?.governance
    ? request({
        url: config.subgraphUrls[chainId]!.governance!,
        variables,
        document: ProposalPreviewsDocument,
      })
    : undefined;
