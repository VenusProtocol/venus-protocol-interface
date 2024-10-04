import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import { type RemoteProposal, RemoteProposalState } from 'types';
import { Status, type StatusProps } from '../../Status';

export type CurrentStepProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<
    RemoteProposal,
    | 'chainId'
    | 'state'
    | 'canceledDate'
    | 'bridgedDate'
    | 'queuedDate'
    | 'executionEtaDate'
    | 'executedDate'
    | 'expiredDate'
  >;

export const CurrentStep: React.FC<CurrentStepProps> = ({
  chainId,
  state,
  canceledDate,
  bridgedDate,
  queuedDate,
  executionEtaDate,
  executedDate,
  expiredDate,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [type, status] = useMemo<[StatusProps['type'], string]>(() => {
    let tmpType: StatusProps['type'] = 'info';
    let tmpStatus = t('voteProposalUi.command.status.pending');

    if (state === RemoteProposalState.Bridged) {
      tmpStatus = t('voteProposalUi.command.status.bridged');
    }

    if (state === RemoteProposalState.Canceled) {
      tmpStatus = t('voteProposalUi.command.status.canceled');
      tmpType = 'error';
    }

    if (state === RemoteProposalState.Queued) {
      tmpStatus = t('voteProposalUi.command.status.queued');
    }

    if (state === RemoteProposalState.Executed) {
      tmpStatus = t('voteProposalUi.command.status.executed');
      tmpType = 'success';
    }

    if (state === RemoteProposalState.Expired) {
      tmpStatus = t('voteProposalUi.command.status.expired');
      tmpType = 'error';
    }

    return [tmpType, tmpStatus];
  }, [state, t]);

  const previousStepDate = useMemo(() => {
    if (state === RemoteProposalState.Bridged) {
      return bridgedDate;
    }

    if (state === RemoteProposalState.Canceled) {
      return canceledDate;
    }

    if (state === RemoteProposalState.Queued) {
      return queuedDate;
    }

    if (state === RemoteProposalState.Executed) {
      return executedDate;
    }

    if (state === RemoteProposalState.Expired) {
      return expiredDate;
    }
  }, [state, bridgedDate, canceledDate, queuedDate, executedDate, expiredDate]);

  const nextStepDate = useMemo(() => {
    let tmpNextStepDate: Date | undefined;

    if (state === RemoteProposalState.Queued) {
      tmpNextStepDate = executionEtaDate;
    }

    return tmpNextStepDate;
  }, [state, executionEtaDate]);

  return (
    <Status
      {...otherProps}
      type={type}
      status={status}
      description={
        previousStepDate
          ? t('voteProposalUi.command.dates.previousStep', { date: previousStepDate })
          : undefined
      }
      subDescription={
        state === RemoteProposalState.Queued
          ? t('voteProposalUi.command.dates.executableAt', {
              date: nextStepDate,
            })
          : undefined
      }
    />
  );
};
