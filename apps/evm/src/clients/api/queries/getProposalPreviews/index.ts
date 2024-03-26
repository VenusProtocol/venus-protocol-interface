import {
  type GetProposalPreviewsInput as GetGqlProposalPreviewsInput,
  type Proposal_Filter,
  formatToProposalPreview,
  getProposalPreviews as getGqlProposalPreviews,
} from 'clients/subgraph';
import { type ChainId, type ProposalPreview, ProposalState } from 'types';

export interface GetProposalPreviewsInput {
  chainId: ChainId;
  currentBlockNumber: number;
  blockTimeMs: number;
  accountAddress?: string;
  proposalState?: ProposalState;
  search?: string;
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
  search,
  accountAddress = '',
}: GetProposalPreviewsInput): Promise<GetProposalPreviewsOutput> => {
  // Handle filtering by proposal state
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

  // Handle searching by text
  if (search) {
    where = {
      ...where,
      description_contains_nocase: search || undefined,
    };
  }

  const getGqlProposals = async () => {
    const variables: GetGqlProposalPreviewsInput['variables'] = {
      skip: page * limit,
      limit,
      accountAddress,
      where,
    };

    const response = await getGqlProposalPreviews({
      chainId,
      variables,
    });

    return {
      gqlProposals: response?.proposals || [],
      total: response?.total.length ?? 0,
    };
  };

  const { gqlProposals, total } = await getGqlProposals();

  const proposalPreviews = (gqlProposals || []).map(gqlProposal =>
    formatToProposalPreview({
      gqlProposal,
      currentBlockNumber,
      blockTimeMs,
    }),
  );

  return {
    proposalPreviews,
    total,
  };
};
