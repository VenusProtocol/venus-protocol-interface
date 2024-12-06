import type BigNumber from 'bignumber.js';
import {
  type GetBscProposalsInput as GetBscGqlProposalsInput,
  enrichRemoteProposals,
  formatToProposal,
  getBscProposals,
} from 'clients/subgraph';
import type { Proposal_Filter, RemoteProposal } from 'clients/subgraph/gql/generated/governanceBsc';
import { PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/governance';
import { type ChainId, type Proposal, ProposalState } from 'types';

export interface GetProposalsInput {
  chainId: ChainId;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
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
  page = 0,
  limit = 10,
  proposalState,
  search,
  accountAddress,
}: GetProposalsInput): Promise<GetProposalsOutput> => {
  // Handle filtering by proposal state
  let where: Proposal_Filter | undefined;

  const proposalExpiredTimestampSeconds = Math.floor(
    (new Date().getTime() - PROPOSAL_EXECUTION_GRACE_PERIOD_MS) / 1000,
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

  const response = await getBscProposals({
    chainId,
    variables,
  });

  const gqlProposals = response?.proposals || [];
  const total = response?.total.length ?? 0;

  // Fetch remote proposals
  const rawGqlRemoteProposals: RemoteProposal[] = [];

  gqlProposals.forEach(gqlProposal =>
    gqlProposal.remoteProposals.forEach(gqlRemoteProposal =>
      rawGqlRemoteProposals.push(gqlRemoteProposal as RemoteProposal),
    ),
  );

  const gqlRemoteProposalsMapping = await enrichRemoteProposals({
    gqlRemoteProposals: rawGqlRemoteProposals,
  });

  const proposals = (gqlProposals || []).map(gqlProposal =>
    formatToProposal({
      gqlProposal,
      gqlRemoteProposalsMapping,
      proposalMinQuorumVotesMantissa,
      currentBlockNumber,
      accountAddress,
    }),
  );

  return {
    proposals,
    total,
  };
};
