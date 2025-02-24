import { Icon, LabeledProgressCircle } from 'components';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { ProposalState, type RemoteProposal, RemoteProposalState } from 'types';
import { cn, getProposalStateLabel } from 'utilities';
import { isProposalExecutable } from 'utilities/isProposalExecutable';
import { Indicator } from './Indicator';

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

  const shouldShowAwaitingExecutionWarning =
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
        'flex items-center gap-3 overflow-hidden text-offWhite sm:flex-col sm:text-center',
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
            />

            {shouldShowAwaitingExecutionWarning && (
              <div className="bg-orange w-4 h-4 rounded-full flex items-center justify-center absolute top-[-2px] right-[-2px] border-[2px] border-cards">
                <Icon name="exclamation" className="w-2 h-2 text-offWhite" />
              </div>
            )}
          </div>
        ) : (
          <Indicator state={state} isExecutable={isExecutable} />
        )}
      </div>

      <p className="text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis flex-grow">
        {label}
      </p>
    </div>
  );
};
