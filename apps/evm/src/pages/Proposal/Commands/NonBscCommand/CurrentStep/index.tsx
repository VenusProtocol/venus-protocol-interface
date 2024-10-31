import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import { type RemoteProposal, RemoteProposalState } from 'types';
import generateExplorerUrl from 'utilities/generateExplorerUrl';
import { Status, type StatusProps } from '../../Status';

export interface CurrentStepProps extends React.HTMLAttributes<HTMLDivElement> {
  remoteProposal: RemoteProposal;
  proposalExecutedTxHash?: string;
}

export const CurrentStep: React.FC<CurrentStepProps> = ({
  proposalExecutedTxHash,
  remoteProposal,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [type, status, statusHref] = useMemo<
    [StatusProps['type'], string, string | undefined]
  >(() => {
    let tmpType: StatusProps['type'] = 'info';
    let tmpStatus = t('voteProposalUi.command.status.pending');
    let tmpStatusHref: string | undefined;

    if (remoteProposal.state === RemoteProposalState.Bridged) {
      tmpStatus = t('proposalState.bridged');
      tmpStatusHref =
        proposalExecutedTxHash &&
        generateExplorerUrl({
          hash: proposalExecutedTxHash,
          urlType: 'layerZeroTx',
          chainId: remoteProposal.chainId,
        });
    }

    if (remoteProposal.state === RemoteProposalState.Canceled) {
      tmpStatus = t('proposalState.canceled');
      tmpType = 'error';
      tmpStatusHref =
        remoteProposal.canceledTxHash &&
        generateExplorerUrl({
          hash: remoteProposal.canceledTxHash,
          urlType: 'tx',
          chainId: remoteProposal.chainId,
        });
    }

    if (remoteProposal.state === RemoteProposalState.Queued) {
      tmpStatus = t('proposalState.queued');
      tmpStatusHref =
        remoteProposal.queuedTxHash &&
        generateExplorerUrl({
          hash: remoteProposal.queuedTxHash,
          urlType: 'tx',
          chainId: remoteProposal.chainId,
        });
    }

    if (remoteProposal.state === RemoteProposalState.Executed) {
      tmpStatus = t('proposalState.executed');
      tmpType = 'success';
      tmpStatusHref =
        remoteProposal.executedTxHash &&
        generateExplorerUrl({
          hash: remoteProposal.executedTxHash,
          urlType: 'tx',
          chainId: remoteProposal.chainId,
        });
    }

    if (remoteProposal.state === RemoteProposalState.Expired) {
      tmpStatus = t('proposalState.expired');
      tmpType = 'error';
    }

    return [tmpType, tmpStatus, tmpStatusHref];
  }, [
    proposalExecutedTxHash,
    remoteProposal.state,
    remoteProposal.chainId,
    remoteProposal.canceledTxHash,
    remoteProposal.queuedTxHash,
    remoteProposal.executedTxHash,
    t,
  ]);

  const previousStepDate = useMemo(() => {
    if (remoteProposal.state === RemoteProposalState.Bridged) {
      return remoteProposal.bridgedDate;
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
  }, [
    remoteProposal.state,
    remoteProposal.bridgedDate,
    remoteProposal.canceledDate,
    remoteProposal.queuedDate,
    remoteProposal.executedDate,
    remoteProposal.expiredDate,
  ]);

  const nextStepDate = useMemo(() => {
    let tmpNextStepDate: Date | undefined;

    if (remoteProposal.state === RemoteProposalState.Queued) {
      tmpNextStepDate = remoteProposal.executionEtaDate;
    }

    return tmpNextStepDate;
  }, [remoteProposal.state, remoteProposal.executionEtaDate]);

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
      subDescription={
        remoteProposal.state === RemoteProposalState.Queued
          ? t('voteProposalUi.command.dates.executableAt', {
              date: nextStepDate,
            })
          : undefined
      }
    />
  );
};
