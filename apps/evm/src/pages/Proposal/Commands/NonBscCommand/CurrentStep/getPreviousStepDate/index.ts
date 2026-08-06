import { type RemoteProposal, RemoteProposalState } from 'types';

export const getPreviousStepDate = ({ remoteProposal }: { remoteProposal: RemoteProposal }) => {
  if (remoteProposal.state === RemoteProposalState.Bridged) {
    return remoteProposal.bridgedDate;
  }

  if (remoteProposal.state === RemoteProposalState.Failed) {
    return remoteProposal.failedDate;
  }

  if (remoteProposal.state === RemoteProposalState.Canceled) {
    return remoteProposal.canceledDate;
  }

  if (remoteProposal.state === RemoteProposalState.Queued) {
    return remoteProposal.queuedDate;
  }

  if (remoteProposal.state === RemoteProposalState.Executed) {
    return remoteProposal.executedDate;
  }

  if (remoteProposal.state === RemoteProposalState.Expired) {
    return remoteProposal.expiredDate;
  }
};
