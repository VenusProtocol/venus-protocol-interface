import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import { governanceChainId } from 'libs/wallet';
import { type Proposal, ProposalState } from 'types';
import { generateExplorerUrl, getProposalStateLabel } from 'utilities';
import { Status, type StatusProps } from '../../Status';
import { getPreviousStepDate } from './getPreviousStepDate';

export interface CurrentStepProps extends React.HTMLAttributes<HTMLDivElement> {
  proposal: Proposal;
}

export const CurrentStep: React.FC<CurrentStepProps> = ({ proposal, ...otherProps }) => {
  const { t } = useTranslation();

  let type: StatusProps['type'] = 'info';
  const status = getProposalStateLabel({ state: proposal.state });
  let statusHref: string | undefined;

  if (proposal.state === ProposalState.Canceled && proposal.cancelTxHash) {
    statusHref = generateExplorerUrl({
      hash: proposal.cancelTxHash,
      urlType: 'tx',
      chainId: governanceChainId,
    });
  }

  if (proposal.state === ProposalState.Queued && proposal.queuedTxHash) {
    statusHref = generateExplorerUrl({
      hash: proposal.queuedTxHash,
      urlType: 'tx',
      chainId: governanceChainId,
    });
  }

  if (proposal.state === ProposalState.Executed && proposal.executedTxHash) {
    statusHref = generateExplorerUrl({
      hash: proposal.executedTxHash,
      urlType: 'tx',
      chainId: governanceChainId,
    });
  }

  if (
    proposal.state === ProposalState.Canceled ||
    proposal.state === ProposalState.Defeated ||
    proposal.state === ProposalState.Expired
  ) {
    type = 'error';
  } else if (proposal.state === ProposalState.Executed) {
    type = 'success';
  }

  const previousStepDate = getPreviousStepDate({ proposal });

  const subDescription = useMemo(() => {
    if (proposal.state === ProposalState.Pending) {
      return t('voteProposalUi.command.dates.activeAt', {
        date: proposal.startDate,
      });
    }

    if (proposal.state === ProposalState.Active) {
      return t('voteProposalUi.command.dates.queueableAt', {
        date: proposal.endDate,
      });
    }

    if (proposal.state === ProposalState.Queued) {
      return t('voteProposalUi.command.dates.executableAt', {
        date: proposal.executionEtaDate,
      });
    }
  }, [t, proposal.state, proposal.startDate, proposal.endDate, proposal.executionEtaDate]);

  return (
    <Status
      {...otherProps}
      type={type}
      status={status}
      statusHref={statusHref}
      description={
        previousStepDate
          ? t('voteProposalUi.command.dates.previousStep', { date: previousStepDate })
          : undefined
      }
      subDescription={subDescription}
    />
  );
};
