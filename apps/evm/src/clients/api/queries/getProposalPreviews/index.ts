import {
  formatToProposalPreview,
  getProposalPreviews as getGqlProposalPreviews,
  type Proposal_Filter,
} from 'clients/subgraph';
import { type ChainId, type ProposalPreview, ProposalState } from 'types';

export interface GetProposalPreviewsInput {
  chainId: ChainId;
  currentBlockNumber: number;
  blockTimeMs: number;
  accountAddress?: string;
  proposalState?: ProposalState;
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
  proposalState,
  accountAddress = '',
}: GetProposalPreviewsInput): Promise<GetProposalPreviewsOutput> => {
  // Handle searching by proposal state
  let where: Proposal_Filter | undefined;
  const nowSeconds = new Date().getTime() * 1000;

  switch (proposalState) {
    case ProposalState.Pending:
      where = { startBlock_gt: currentBlockNumber };
      break;
    case ProposalState.Active:
      where = { endBlock_gt: currentBlockNumber };
      break;
    case ProposalState.Canceled:
      where = { canceled_not: null };
      break;
    case ProposalState.Defeated:
      where = { passing: false, endBlock_lt: currentBlockNumber };
      break;
    case ProposalState.Executed:
      where = { executed_not: null };
      break;
    case ProposalState.Queued:
      where = {
        queued_not: null,
        executed: null,
        canceled: null,
        executionEta_gt: nowSeconds.toString(),
      };
      break;
    case ProposalState.Expired:
      where = {
        queued_not: null,
        executed: null,
        canceled: null,
        executionEta_lt: nowSeconds.toString(),
      };
      break;
    case ProposalState.Succeeded:
      where = { passing: true, endBlock_lt: currentBlockNumber };
      break;
  }

  const response = await getGqlProposalPreviews({
    page,
    limit,
    accountAddress,
    chainId,
    where,
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
