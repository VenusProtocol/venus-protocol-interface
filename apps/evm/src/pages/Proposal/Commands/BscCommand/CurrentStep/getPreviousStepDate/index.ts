import { type Proposal, ProposalState } from 'types';

export const getPreviousStepDate = ({ proposal }: { proposal: Proposal }) => {
  if (proposal.state === ProposalState.Pending) {
    return proposal.createdDate;
  }

  if (proposal.state === ProposalState.Canceled) {
    return proposal.cancelDate;
  }

  if (proposal.state === ProposalState.Active) {
    return proposal.startDate;
  }

  if (proposal.state === ProposalState.Defeated) {
    return proposal.endDate;
  }

  if (proposal.state === ProposalState.Queued) {
    return proposal.queuedDate;
  }

  if (proposal.state === ProposalState.Executed) {
    return proposal.executedDate;
  }

  if (proposal.state === ProposalState.Expired) {
    return proposal.expiredDate;
  }
};
