import type BigNumber from 'bignumber.js';
import {
  type GetBscProposalsInput as GetBscGqlProposalsInput,
  formatToProposal,
  getBscProposals as getBscGqlProposals,
} from 'clients/subgraph';
import type { Proposal_Filter } from 'clients/subgraph/gql/generated/governanceBsc';
import { type ChainId, type Proposal, ProposalState } from 'types';

export interface GetProposalsInput {
  chainId: ChainId;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  blockTimeMs: number;
  proposalExecutionGracePeriodMs: number;
  accountAddress?: string;
  proposalState?: ProposalState;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetProposalsOutput {
  proposals: Proposal[];
  total: number;
}

export const getProposals = async ({
  chainId,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  proposalExecutionGracePeriodMs,
  blockTimeMs,
  page = 0,
  limit = 10,
  proposalState,
  search,
  accountAddress,
}: GetProposalsInput): Promise<GetProposalsOutput> => {
  // Handle filtering by proposal state
  let where: Proposal_Filter | undefined;

  const proposalExpiredTimestampSeconds = Math.floor(
    (new Date().getTime() - (proposalExecutionGracePeriodMs ?? 0)) / 1000,
  );

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
      where = {
        or: [
          { canceled: null, passing: false, endBlock_lt: currentBlockNumber },
          {
            or: [
              {
                canceled: null,
                endBlock_lt: currentBlockNumber,
                forVotes_lt: proposalMinQuorumVotesMantissa.toFixed(),
              },
            ],
          },
        ],
      };
      break;
    case ProposalState.Succeeded:
      where = {
        passing: true,
        canceled: null,
        queued: null,
        executed: null,
        endBlock_lt: currentBlockNumber,
        forVotes_gte: proposalMinQuorumVotesMantissa.toFixed(),
      };
      break;
    case ProposalState.Queued:
      where = {
        canceled: null,
        queued_not: null,
        executed: null,
        executionEta_gte: proposalExpiredTimestampSeconds.toString(),
      };
      break;
    case ProposalState.Expired:
      where = {
        canceled: null,
        queued_not: null,
        executed: null,
        executionEta_lt: proposalExpiredTimestampSeconds.toString(),
      };
      break;
    case ProposalState.Executed:
      where = { executed_not: null };
      break;
  }

  // Handle searching by text
  if (search) {
    where = {
      ...where,
      description_contains_nocase: search || undefined,
    };
  }

  const variables: GetBscGqlProposalsInput['variables'] = {
    skip: page * limit,
    limit,
    where,
  };

  const response = await getBscGqlProposals({
    chainId,
    variables,
  });

  const gqlProposals = response?.proposals || [];
  const total = response?.total.length ?? 0;

  const proposals = (gqlProposals || []).map(gqlProposal =>
    formatToProposal({
      gqlProposal,
      proposalMinQuorumVotesMantissa,
      proposalExecutionGracePeriodMs,
      currentBlockNumber,
      blockTimeMs,
      accountAddress,
    }),
  );

  return {
    proposals,
    total,
  };
};
