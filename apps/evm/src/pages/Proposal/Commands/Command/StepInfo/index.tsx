import { Icon, type IconName } from 'components';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { type RemoteProposal, RemoteProposalState } from 'types';
import { cn } from 'utilities';

export type StepInfoProps = React.HTMLAttributes<HTMLDivElement> &
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

export const StepInfo: React.FC<StepInfoProps> = ({
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

  const getStatusColor = () => {
    if (state === RemoteProposalState.Executed) {
      return 'text-green';
    }

    if (state === RemoteProposalState.Canceled || state === RemoteProposalState.Expired) {
      return 'text-red';
    }

    return 'text-offWhite';
  };

  const getIconName = (): IconName => {
    if (state === RemoteProposalState.Executed) {
      return 'mark';
    }

    if (state === RemoteProposalState.Canceled) {
      return 'close';
    }

    return 'dots';
  };

  const getStatusText = () => {
    if (state === RemoteProposalState.Pending) {
      return t('voteProposalUi.command.status.pending');
    }

    if (state === RemoteProposalState.Bridged) {
      return t('voteProposalUi.command.status.bridged');
    }

    if (state === RemoteProposalState.Canceled) {
      return t('voteProposalUi.command.status.canceled');
    }

    if (state === RemoteProposalState.Queued) {
      return t('voteProposalUi.command.status.queued');
    }

    if (state === RemoteProposalState.Executed) {
      return t('voteProposalUi.command.status.executed');
    }

    if (state === RemoteProposalState.Expired) {
      return t('voteProposalUi.command.status.expired');
    }
  };

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
    <div {...otherProps}>
      <div className={cn('flex items-center justify-end gap-x-1', getStatusColor())}>
        <Icon className="text-inherit w-5 h-5" name={getIconName()} />

        <span className="text-sm font-semibold">{getStatusText()}</span>
      </div>

      {state !== RemoteProposalState.Pending && (
        <div className="mt-1 text-xs text-right">
          {previousStepDate && (
            <p className="text-grey">
              {t('voteProposalUi.command.dates.previousStep', { date: previousStepDate })}
            </p>
          )}

          {state === RemoteProposalState.Queued && (
            <p>
              {t('voteProposalUi.command.dates.executableAt', {
                date: nextStepDate,
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
