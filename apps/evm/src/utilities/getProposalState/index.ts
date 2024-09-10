import type BigNumber from 'bignumber.js';
import { ProposalState } from 'types';

export interface GetProposalStateInput {
  startBlockNumber: number;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  forVotesMantissa: BigNumber;
  endBlockNumber: number;
  passing: boolean;
  queued: boolean;
  executed: boolean;
  canceled: boolean;
  executionEtaTimestampMs?: number;
  proposalExecutionGracePeriodMs?: number;
}

export const getProposalState = ({
  startBlockNumber,
  endBlockNumber,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  proposalExecutionGracePeriodMs,
  forVotesMantissa,
  passing,
  queued,
  executed,
  canceled,
  executionEtaTimestampMs,
}: GetProposalStateInput) => {
  if (startBlockNumber > currentBlockNumber) {
    return ProposalState.Pending;
  }

  if (endBlockNumber > currentBlockNumber) {
    return ProposalState.Active;
  }

  if (canceled) {
    return ProposalState.Canceled;
  }

  const nowMs = new Date().getTime();
  const expiredEtaTimestampMs =
    (executionEtaTimestampMs ?? 0) + (proposalExecutionGracePeriodMs ?? 0);

  if (queued && !executed && !canceled && expiredEtaTimestampMs < nowMs) {
    return ProposalState.Expired;
  }

  if (
    queued &&
    !executed &&
    !canceled &&
    executionEtaTimestampMs &&
    executionEtaTimestampMs >= nowMs
  ) {
    return ProposalState.Queued;
  }

  if (executed) {
    return ProposalState.Executed;
  }

  if (
    passing &&
    endBlockNumber < currentBlockNumber &&
    forVotesMantissa.isGreaterThanOrEqualTo(proposalMinQuorumVotesMantissa)
  ) {
    return ProposalState.Succeeded;
  }

  return ProposalState.Defeated;
};
