import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import { governanceChain } from 'libs/wallet';
import { type Proposal, ProposalState } from 'types';
import { generateExplorerUrl, getProposalStateLabel } from 'utilities';
import { Status, type StatusProps } from '../../Status';

export interface CurrentStepProps extends React.HTMLAttributes<HTMLDivElement> {
  proposal: Proposal;
}

export const CurrentStep: React.FC<CurrentStepProps> = ({ proposal, ...otherProps }) => {
  const { t } = useTranslation();

  const [type, status, statusHref] = useMemo<
    [StatusProps['type'], string, string | undefined]
  >(() => {
    let tmpType: StatusProps['type'] = 'info';
    const tmpStatus = getProposalStateLabel({ state: proposal.state });
    let tmpStatusHref: string | undefined;

    if (proposal.state === ProposalState.Canceled && proposal.cancelTxHash) {
      tmpStatusHref = generateExplorerUrl({
        hash: proposal.cancelTxHash,
        urlType: 'tx',
        chainId: governanceChain.id,
      });
    }

    if (proposal.state === ProposalState.Queued && proposal.queuedTxHash) {
      tmpStatusHref = generateExplorerUrl({
        hash: proposal.queuedTxHash,
        urlType: 'tx',
        chainId: governanceChain.id,
      });
    }

    if (proposal.state === ProposalState.Executed && proposal.executedTxHash) {
      tmpStatusHref = generateExplorerUrl({
        hash: proposal.executedTxHash,
        urlType: 'tx',
        chainId: governanceChain.id,
      });
    }

    if (
      proposal.state === ProposalState.Canceled ||
      proposal.state === ProposalState.Defeated ||
      proposal.state === ProposalState.Expired
    ) {
      tmpType = 'error';
    } else if (proposal.state === ProposalState.Executed) {
      tmpType = 'success';
    }

    return [tmpType, tmpStatus, tmpStatusHref];
  }, [
    proposal.state,
    proposal.cancelTxHash,
    proposal.queuedTxHash,
    proposal.queuedTxHash,
    proposal.executedTxHash,
  ]);

  const previousStepDate = useMemo(() => {
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
  }, [
    proposal.state,
    proposal.createdDate,
    proposal.cancelDate,
    proposal.startDate,
    proposal.endDate,
    proposal.queuedDate,
    proposal.executedDate,
    proposal.expiredDate,
  ]);

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
