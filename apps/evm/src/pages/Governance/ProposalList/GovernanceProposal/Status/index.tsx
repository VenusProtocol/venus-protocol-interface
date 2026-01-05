import { cn, theme } from '@venusprotocol/ui';
import { LabeledProgressCircle } from 'components';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { ProposalState, type RemoteProposal, RemoteProposalState } from 'types';
import { getProposalStateLabel } from 'utilities';
import { isProposalExecutable } from 'utilities/isProposalExecutable';
import { Indicator } from './Indicator';
import { Warning } from './Warning';

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  state: ProposalState;
  remoteProposals: RemoteProposal[];
  executionEtaDate?: Date;
}

export const Status: React.FC<StatusProps> = ({
  state,
  remoteProposals,
  executionEtaDate,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const now = useNow();

  const isExecutable = isProposalExecutable({
    now,
    isQueued: state === ProposalState.Queued,
    executionEtaDate,
  });

  const totalPayloadsCount = 1 + remoteProposals.length; // BSC proposal + remote proposals
  const executedPayloadsCount =
    (state === ProposalState.Executed ? 1 : 0) +
    remoteProposals.filter(remoteProposal => remoteProposal.state === RemoteProposalState.Executed)
      .length;

  const hasRemoteCommandsAwaitingExecution =
    state === ProposalState.Executed &&
    remoteProposals.some(
      remoteProposal =>
        remoteProposal.state === RemoteProposalState.Queued &&
        isProposalExecutable({
          now,
          isQueued: remoteProposal.state === RemoteProposalState.Queued,
          executionEtaDate: remoteProposal.executionEtaDate,
        }),
    );

  const hasRemoteCommandsCanceled =
    state === ProposalState.Executed &&
    remoteProposals.some(remoteProposal => remoteProposal.state === RemoteProposalState.Canceled);

  const isFullyExecuted = executedPayloadsCount === totalPayloadsCount;
  const shouldShowExecutedPayloadsStatus = state === ProposalState.Executed && !isFullyExecuted;

  const label = useMemo(() => {
    if (shouldShowExecutedPayloadsStatus) {
      return t('voteProposalUi.status.executedPayloads');
    }

    if (isExecutable) {
      return t('voteProposalUi.status.readyForExecution');
    }

    if (state === ProposalState.Succeeded) {
      return t('voteProposalUi.status.readyForQueuing');
    }

    return getProposalStateLabel({ state });
  }, [t, state, shouldShowExecutedPayloadsStatus, isExecutable]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 overflow-hidden text-white sm:flex-col sm:text-center',
        className,
      )}
      {...otherProps}
    >
      <div className="shrink-0">
        {shouldShowExecutedPayloadsStatus ? (
          <div className="relative">
            <LabeledProgressCircle
              total={totalPayloadsCount}
              value={executedPayloadsCount}
              className="mx-auto"
              fillColor={hasRemoteCommandsCanceled ? theme.colors.red : undefined}
            />

            {(hasRemoteCommandsAwaitingExecution || hasRemoteCommandsCanceled) && (
              <Warning variant={hasRemoteCommandsAwaitingExecution ? 'warning' : 'error'} />
            )}
          </div>
        ) : (
          <Indicator state={state} isExecutable={isExecutable} />
        )}
      </div>

      <p className="text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis grow">
        {label}
      </p>
    </div>
  );
};
