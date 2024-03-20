import { ProposalState } from 'types';

export interface GetProposalStateInput {
  startBlockNumber: number;
  currentBlockNumber: number;
  endBlockNumber: number;
  passing: boolean;
  queued: boolean;
  executed: boolean;
  canceled: boolean;
  executionEtaTimestampSeconds?: number;
}

export const getProposalState = ({
  startBlockNumber,
  endBlockNumber,
  currentBlockNumber,
  passing,
  queued,
  executed,
  canceled,
  executionEtaTimestampSeconds,
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

  if (
    queued &&
    !executed &&
    !canceled &&
    executionEtaTimestampSeconds &&
    executionEtaTimestampSeconds * 1000 >= nowMs
  ) {
    return ProposalState.Queued;
  }

  if (executed) {
    return ProposalState.Executed;
  }

  if (
    queued &&
    !executed &&
    !canceled &&
    executionEtaTimestampSeconds &&
    executionEtaTimestampSeconds * 1000 < nowMs
  ) {
    return ProposalState.Expired;
  }

  if (passing && endBlockNumber < currentBlockNumber) {
    return ProposalState.Succeeded;
  }

  return ProposalState.Defeated;
};
