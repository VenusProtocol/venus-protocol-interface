import BigNumber from 'bignumber.js';
import type { ProposalsQuery } from 'clients/subgraph/gql/generated/governanceBsc';
import {
  type AbstainVoter,
  type AgainstVoter,
  type ForVoter,
  type Proposal,
  VoteSupport,
} from 'types';
import {
  areAddressesEqual,
  convertToDate,
  formatToProposalDescription,
  getProposalState,
  getProposalType,
  getUserVoteSupport,
} from 'utilities';
import { formatToProposalActions } from './formatToProposalActions';

export const formatToProposal = ({
  gqlProposal,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  proposalExecutionGracePeriodMs,
  accountAddress,
  blockTimeMs,
}: {
  gqlProposal: ProposalsQuery['proposals'][number];
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  blockTimeMs: number;
  proposalExecutionGracePeriodMs?: number;
  accountAddress?: string;
}) => {
  const executionEtaDate = convertToDate({ timestampSeconds: Number(gqlProposal.executionEta) });

  const nowMs = new Date().getTime();
  const startDate = new Date(nowMs + (gqlProposal.startBlock - currentBlockNumber) * blockTimeMs);
  const endDate = new Date(nowMs + (gqlProposal.endBlock - currentBlockNumber) * blockTimeMs);

  // Extract BSC proposal actions
  const proposalActions = formatToProposalActions({
    callDatas: gqlProposal.calldatas || [],
    signatures: gqlProposal.signatures || [],
    targets: gqlProposal.targets || [],
    values: gqlProposal.values || [],
  });

  // Extract votes
  const {
    forVotes,
    againstVotes,
    abstainVotes,
    totalVotesMantissa,
    abstainedVotesMantissa,
    againstVotesMantissa,
    forVotesMantissa,
    userVoteSupport,
  } = gqlProposal.votes.reduce<{
    forVotes: ForVoter[];
    againstVotes: AgainstVoter[];
    abstainVotes: AbstainVoter[];
    totalVotesMantissa: BigNumber;
    abstainedVotesMantissa: BigNumber;
    againstVotesMantissa: BigNumber;
    forVotesMantissa: BigNumber;
    userVoteSupport?: VoteSupport;
  }>(
    (acc, gqlVote) => {
      const accCopy = { ...acc };

      const vote = {
        proposalId: gqlProposal.proposalId,
        address: gqlVote.voter.id,
        reason: gqlVote.reason ?? undefined,
        support: getUserVoteSupport({ voteSupport: gqlVote.support }),
        votesMantissa: new BigNumber(gqlVote.votes),
      };

      accCopy.totalVotesMantissa = accCopy.totalVotesMantissa.plus(vote.votesMantissa);

      if (vote.support === VoteSupport.For) {
        accCopy.forVotes.push(vote as ForVoter);
        accCopy.forVotesMantissa = accCopy.forVotesMantissa.plus(vote.votesMantissa);
      } else if (vote.support === VoteSupport.Against) {
        accCopy.againstVotes.push(vote as AgainstVoter);
        accCopy.againstVotesMantissa = accCopy.againstVotesMantissa.plus(vote.votesMantissa);
      } else {
        accCopy.abstainVotes.push(vote as AbstainVoter);
        accCopy.abstainedVotesMantissa = accCopy.abstainedVotesMantissa.plus(vote.votesMantissa);
      }

      if (!!accountAddress && areAddressesEqual(accountAddress, vote.address)) {
        accCopy.userVoteSupport = vote.support;
      }

      return accCopy;
    },
    {
      forVotes: [],
      againstVotes: [],
      abstainVotes: [],
      totalVotesMantissa: new BigNumber(0),
      abstainedVotesMantissa: new BigNumber(0),
      againstVotesMantissa: new BigNumber(0),
      forVotesMantissa: new BigNumber(0),
      userVoteSupport: undefined,
    },
  );

  const result: Proposal = {
    proposalId: gqlProposal.proposalId,
    proposalType: getProposalType({ type: gqlProposal.type }),
    proposerAddress: gqlProposal.proposer.id,
    state: getProposalState({
      startBlockNumber: gqlProposal.startBlock,
      endBlockNumber: gqlProposal.endBlock,
      currentBlockNumber,
      proposalMinQuorumVotesMantissa,
      proposalExecutionGracePeriodMs,
      forVotesMantissa,
      passing: gqlProposal.passing,
      queued: !!gqlProposal.queued?.timestamp,
      executed: !!gqlProposal.executed?.timestamp,
      canceled: !!gqlProposal.canceled?.timestamp,
      executionEtaTimestampMs: gqlProposal.executionEta,
    }),
    description: formatToProposalDescription({ description: gqlProposal.description }),
    endBlock: +gqlProposal.endBlock,
    createdDate: gqlProposal.created?.timestamp
      ? convertToDate({ timestampSeconds: gqlProposal.created.timestamp })
      : undefined,
    cancelDate: gqlProposal.canceled?.timestamp
      ? convertToDate({ timestampSeconds: gqlProposal.canceled.timestamp })
      : undefined,
    queuedDate: gqlProposal.queued?.timestamp
      ? convertToDate({ timestampSeconds: gqlProposal.queued.timestamp })
      : undefined,
    executedDate: gqlProposal.executed?.timestamp
      ? convertToDate({ timestampSeconds: gqlProposal.executed.timestamp })
      : undefined,
    proposalActions,
    forVotes,
    againstVotes,
    abstainVotes,
    abstainedVotesMantissa,
    againstVotesMantissa,
    forVotesMantissa,
    totalVotesMantissa,
    userVoteSupport,
    createdTxHash: gqlProposal.created?.txHash,
    cancelTxHash: gqlProposal.canceled?.txHash,
    executedTxHash: gqlProposal.executed?.txHash,
    queuedTxHash: gqlProposal.queued?.txHash,
    startDate,
    endDate,
    executionEtaDate,
  };

  return result;
};
