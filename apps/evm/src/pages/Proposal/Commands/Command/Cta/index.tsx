import { Button, Icon, type IconName } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useTranslation } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { useMemo } from 'react';
import { type ProposalCommand, ProposalCommandState } from 'types';
import { cn } from 'utilities';
import { useCommand } from '../useCommand';

export type CtaProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<
    ProposalCommand,
    | 'chainId'
    | 'state'
    | 'failedExecutionAt'
    | 'canceledAt'
    | 'bridgedAt'
    | 'queuedAt'
    | 'succeededAt'
    | 'executableAt'
    | 'executedAt'
    | 'expiredAt'
  >;

export const Cta: React.FC<CtaProps> = ({
  chainId,
  state,
  failedExecutionAt,
  canceledAt,
  bridgedAt,
  queuedAt,
  executableAt,
  executedAt,
  expiredAt,
  ...otherProps
}) => {
  const { isOnWrongChain, isExecutable, hasFailedExecution } = useCommand({
    chainId,
    state,
    executableAt,
    failedExecutionAt,
    executedAt,
  });
  const { switchChain } = useSwitchChain();
  const chainMetadata = CHAIN_METADATA[chainId];

  const { t } = useTranslation();

  // TODO: wire up (see VEN-2701)
  const execute = () => {};
  const retry = () => {};

  const getStatusColor = () => {
    if (state === ProposalCommandState.Executed) {
      return 'text-green';
    }

    if (state === ProposalCommandState.Canceled || state === ProposalCommandState.Expired) {
      return 'text-red';
    }

    return 'text-offWhite';
  };

  const getIconName = (): IconName => {
    if (state === ProposalCommandState.Executed) {
      return 'mark';
    }

    if (state === ProposalCommandState.Canceled) {
      return 'close';
    }

    return 'dots';
  };

  const getStatusText = () => {
    if (state === ProposalCommandState.Pending) {
      return t('voteProposalUi.command.status.pending');
    }

    if (state === ProposalCommandState.Bridged) {
      return t('voteProposalUi.command.status.bridged');
    }

    if (state === ProposalCommandState.Canceled) {
      return t('voteProposalUi.command.status.canceled');
    }

    if (state === ProposalCommandState.Queued) {
      return t('voteProposalUi.command.status.queued');
    }

    if (state === ProposalCommandState.Succeeded) {
      return t('voteProposalUi.command.status.succeeded');
    }

    if (state === ProposalCommandState.Executed) {
      return t('voteProposalUi.command.status.executed');
    }

    if (state === ProposalCommandState.Expired) {
      return t('voteProposalUi.command.status.expired');
    }
  };

  const previousStepDate = useMemo(() => {
    if (state === ProposalCommandState.Bridged) {
      return bridgedAt;
    }

    if (state === ProposalCommandState.Canceled) {
      return canceledAt;
    }

    if (state === ProposalCommandState.Queued) {
      return queuedAt;
    }

    if (state === ProposalCommandState.Executed) {
      return executedAt;
    }

    if (state === ProposalCommandState.Expired) {
      return expiredAt;
    }
  }, [state, bridgedAt, canceledAt, queuedAt, executedAt, expiredAt]);

  const nextStepDate = useMemo(() => {
    let tmpNextStepDate: Date | undefined;

    if (state === ProposalCommandState.Bridged) {
      tmpNextStepDate = queuedAt;
    }

    if (state === ProposalCommandState.Queued) {
      tmpNextStepDate = executableAt;
    }

    return tmpNextStepDate;
  }, [state, executableAt, queuedAt]);

  const getButtonLabel = () => {
    if (isOnWrongChain) {
      return t('voteProposalUi.command.cta.wrongChain', {
        chainName: chainMetadata.name,
      });
    }

    if (hasFailedExecution) {
      return t('voteProposalUi.command.cta.retry');
    }

    return t('voteProposalUi.command.cta.execute');
  };

  const onButtonClick = () => {
    if (isOnWrongChain) {
      return switchChain({ chainId });
    }

    if (hasFailedExecution) {
      return retry();
    }

    return execute();
  };

  return (
    <div {...otherProps}>
      {isExecutable ? (
        <Button onClick={onButtonClick}>{getButtonLabel()}</Button>
      ) : (
        <>
          <div className={cn('flex items-center justify-end gap-x-1', getStatusColor())}>
            <Icon className="text-inherit w-5 h-5" name={getIconName()} />

            <span className="text-sm font-semibold">{getStatusText()}</span>
          </div>

          {state !== ProposalCommandState.Pending && (
            <div className="mt-1 text-xs text-right">
              {previousStepDate && (
                <p className="text-grey">
                  {t('voteProposalUi.command.dates.previousStep', { date: previousStepDate })}
                </p>
              )}

              {(state === ProposalCommandState.Bridged ||
                state === ProposalCommandState.Queued) && (
                <p>
                  {state === ProposalCommandState.Bridged
                    ? t('voteProposalUi.command.dates.queuedIn', {
                        date: nextStepDate,
                      })
                    : t('voteProposalUi.command.dates.executableIn', {
                        date: nextStepDate,
                      })}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
