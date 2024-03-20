import {
  formatToProposalPreview,
  getProposalPreviews as getGqlProposalPreviews,
} from 'clients/subgraph';
import type { ChainId, ProposalPreview } from 'types';

export interface GetProposalPreviewsInput {
  chainId: ChainId;
  currentBlockNumber: number;
  blockTimeMs: number;
  accountAddress?: string;
  page?: number;
  limit?: number;
}

export interface GetProposalPreviewsOutput {
  proposalPreviews: ProposalPreview[];
  total: number;
}

export const getProposalPreviews = async ({
  chainId,
  currentBlockNumber,
  blockTimeMs,
  page = 0,
  limit = 10,
  accountAddress = '',
}: GetProposalPreviewsInput): Promise<GetProposalPreviewsOutput> => {
  const response = await getGqlProposalPreviews({
    page,
    limit,
    accountAddress,
    chainId,
  });

  const proposalPreviews = (response?.proposals || []).map(gqlProposal =>
    formatToProposalPreview({
      gqlProposal,
      currentBlockNumber,
      blockTimeMs,
    }),
  );

  return {
    proposalPreviews,
    total: +(response?.total[0].id || 0), // We use the ID of the most recent proposal as total counter
  };
};
