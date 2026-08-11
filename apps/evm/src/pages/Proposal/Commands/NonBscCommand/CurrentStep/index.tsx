import { useTranslation } from 'libs/translations';
import { governanceChainId } from 'libs/wallet';
import { type RemoteProposal, RemoteProposalState } from 'types';
import generateExplorerUrl from 'utilities/generateExplorerUrl';
import { Status, type StatusProps } from '../../Status';
import { getPreviousStepDate } from './getPreviousStepDate';

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

  let type: StatusProps['type'] = 'info';
  let status = t('voteProposalUi.command.status.pending');
  let statusHref: string | undefined;

  if (remoteProposal.state === RemoteProposalState.Bridged) {
    status = t('proposalState.bridged');
    statusHref =
      proposalExecutedTxHash &&
      generateExplorerUrl({
        hash: proposalExecutedTxHash,
        urlType: 'layerZeroTx',
        chainId: remoteProposal.chainId,
      });
  }

  if (remoteProposal.state === RemoteProposalState.Canceled) {
    status = t('proposalState.canceled');
    type = 'error';
    statusHref =
      remoteProposal.canceledTxHash &&
      generateExplorerUrl({
        hash: remoteProposal.canceledTxHash,
        urlType: 'tx',
        chainId: remoteProposal.chainId,
      });
  }

  if (remoteProposal.state === RemoteProposalState.Failed) {
    status = t('proposalState.failed');
    type = 'error';
    statusHref =
      remoteProposal.failedTxHash &&
      generateExplorerUrl({
        hash: remoteProposal.failedTxHash,
        urlType: 'tx',
        chainId: governanceChainId,
      });
  }

  if (remoteProposal.state === RemoteProposalState.Queued) {
    status = t('proposalState.queued');
    statusHref =
      remoteProposal.queuedTxHash &&
      generateExplorerUrl({
        hash: remoteProposal.queuedTxHash,
        urlType: 'tx',
        chainId: remoteProposal.chainId,
      });
  }

  if (remoteProposal.state === RemoteProposalState.Executed) {
    status = t('proposalState.executed');
    type = 'success';
    statusHref =
      remoteProposal.executedTxHash &&
      generateExplorerUrl({
        hash: remoteProposal.executedTxHash,
        urlType: 'tx',
        chainId: remoteProposal.chainId,
      });
  }

  if (remoteProposal.state === RemoteProposalState.Expired) {
    status = t('proposalState.expired');
    type = 'error';
  }

  const previousStepDate = getPreviousStepDate({ remoteProposal });

  const nextStepDate =
    remoteProposal.state === RemoteProposalState.Queued
      ? remoteProposal.executionEtaDate
      : undefined;

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
