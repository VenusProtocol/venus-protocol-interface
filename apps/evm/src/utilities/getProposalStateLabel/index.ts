import { t } from 'libs/translations';
import { ProposalState } from 'types';

export const getProposalStateLabel = ({ state }: { state: ProposalState }) => {
  switch (state) {
    case ProposalState.Pending:
      return t('proposalState.pending');
    case ProposalState.Active:
      return t('proposalState.active');
    case ProposalState.Canceled:
      return t('proposalState.canceled');
    case ProposalState.Defeated:
      return t('proposalState.defeated');
    case ProposalState.Succeeded:
      return t('proposalState.succeeded');
    case ProposalState.Queued:
      return t('proposalState.queued');
    case ProposalState.Expired:
      return t('proposalState.expired');
    case ProposalState.Executed:
      return t('proposalState.executed');
  }
};
