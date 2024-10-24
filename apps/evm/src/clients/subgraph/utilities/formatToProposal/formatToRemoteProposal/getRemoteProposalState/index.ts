import { PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/chainMetadata';
import { ProposalState, RemoteProposalState } from 'types';

export const getRemoteProposalState = ({
  proposalState,
  isRemoteProposalBridged,
  isRemoteProposalQueued,
  isRemoteProposalCanceled,
  isRemoteProposalExecuted,
  remoteProposalExecutionEtaDate,
}: {
  proposalState: ProposalState;
  isRemoteProposalBridged: boolean;
  isRemoteProposalQueued: boolean;
  isRemoteProposalExecuted: boolean;
  isRemoteProposalCanceled: boolean;
  remoteProposalExecutionEtaDate?: Date;
}) => {
  if (
    isRemoteProposalCanceled ||
    proposalState === ProposalState.Canceled ||
    proposalState === ProposalState.Defeated ||
    proposalState === ProposalState.Expired
  ) {
    return RemoteProposalState.Canceled;
  }

  if (isRemoteProposalExecuted) {
    return RemoteProposalState.Executed;
  }

  if (!isRemoteProposalBridged && !isRemoteProposalQueued) {
    return RemoteProposalState.Pending;
  }

  if (isRemoteProposalBridged && !isRemoteProposalQueued) {
    return RemoteProposalState.Bridged;
  }

  if (!remoteProposalExecutionEtaDate) {
    return RemoteProposalState.Queued;
  }

  const nowMs = new Date().getTime();
  const expiredEtaTimestampMs =
    remoteProposalExecutionEtaDate.getTime() + PROPOSAL_EXECUTION_GRACE_PERIOD_MS;

  const expired = expiredEtaTimestampMs < nowMs;

  if (isRemoteProposalQueued && !expired) {
    return RemoteProposalState.Queued;
  }

  return RemoteProposalState.Expired;
};
