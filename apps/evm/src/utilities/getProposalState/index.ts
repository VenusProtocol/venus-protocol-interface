import type BigNumber from 'bignumber.js';
import { PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/governance';
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
}

export const getProposalState = ({
  startBlockNumber,
  endBlockNumber,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
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
  const expiredEtaTimestampMs = (executionEtaTimestampMs ?? 0) + PROPOSAL_EXECUTION_GRACE_PERIOD_MS;

  if (queued && !executed && expiredEtaTimestampMs < nowMs) {
    return ProposalState.Expired;
  }

  if (queued && !executed) {
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
