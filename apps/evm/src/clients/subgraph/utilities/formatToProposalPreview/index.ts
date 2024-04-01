import BigNumber from 'bignumber.js';
import type { ProposalPreviewsQuery } from 'clients/subgraph';
import type { ProposalPreview } from 'types';
import { convertToDate, formatToProposalDescription } from 'utilities';
import { getProposalState } from './getProposalState';
import { getProposalType } from './getProposalType';
import { getUserVoteSupport } from './getUserVoteSupport';

export const formatToProposalPreview = ({
  gqlProposal,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  blockTimeMs,
}: {
  gqlProposal: ProposalPreviewsQuery['proposals'][number];
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  blockTimeMs: number;
}) => {
  const nowMs = new Date().getTime();
  const endDate = new Date(nowMs + (gqlProposal.endBlock - currentBlockNumber) * blockTimeMs);
  const forVotesMantissa = new BigNumber(gqlProposal.forVotes);

  const res: ProposalPreview = {
    proposalId: +gqlProposal.id,
    description: formatToProposalDescription({ description: gqlProposal.description }),
    state: getProposalState({
      startBlockNumber: gqlProposal.startBlock,
      endBlockNumber: gqlProposal.endBlock,
      proposalMinQuorumVotesMantissa,
      currentBlockNumber,
      passing: gqlProposal.passing,
      queued: !!gqlProposal.queued,
      executed: !!gqlProposal.executed,
      canceled: !!gqlProposal.canceled,
      forVotesMantissa,
      executionEtaTimestampSeconds: gqlProposal.executionEta,
    }),
    againstVotesMantissa: new BigNumber(gqlProposal.againstVotes),
    forVotesMantissa,
    abstainedVotesMantissa: new BigNumber(gqlProposal.abstainVotes),
    executedDate: gqlProposal.executed
      ? convertToDate({ timestampSeconds: gqlProposal.executed.timestamp })
      : undefined,
    queuedDate: gqlProposal.queued
      ? convertToDate({ timestampSeconds: gqlProposal.queued.timestamp })
      : undefined,
    cancelDate: gqlProposal.canceled
      ? convertToDate({ timestampSeconds: gqlProposal.canceled.timestamp })
      : undefined,
    etaDate: gqlProposal.executionEta
      ? convertToDate({ timestampSeconds: gqlProposal.executionEta })
      : undefined,
    endDate,
    userVoteSupport:
      gqlProposal.votes?.[0] && getUserVoteSupport({ voteSupport: gqlProposal.votes[0].support }),
    proposalType: getProposalType({ type: gqlProposal.type }),
  };

  return res;
};
