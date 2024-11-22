import { LabeledProgressCircle } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { ProposalState } from 'types';
import { cn, getProposalStateLabel } from 'utilities';
import { Indicator } from './Indicator';

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  state: ProposalState;
  totalPayloadsCount: number;
  executedPayloadsCount: number;
}

export const Status: React.FC<StatusProps> = ({
  state,
  totalPayloadsCount,
  executedPayloadsCount,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const isMultichainGovernanceFeatureEnabled = useIsFeatureEnabled({
    name: 'omnichainGovernance',
  });

  const isFullyExecuted = executedPayloadsCount === totalPayloadsCount;
  const shouldShowExecutedPayloadsStatus =
    isMultichainGovernanceFeatureEnabled && state === ProposalState.Executed && !isFullyExecuted;

  const label = useMemo(() => {
    if (shouldShowExecutedPayloadsStatus) {
      return t('voteProposalUi.status.executedPayloads');
    }

    if (state === ProposalState.Succeeded) {
      return t('voteProposalUi.status.readyForExecution');
    }

    return getProposalStateLabel({ state });
  }, [t, state, shouldShowExecutedPayloadsStatus]);

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
          <LabeledProgressCircle
            total={totalPayloadsCount}
            value={executedPayloadsCount}
            className="mx-auto"
          />
        ) : (
          <Indicator state={state} />
        )}
      </div>

      <p className="text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis flex-grow">
        {label}
      </p>
    </div>
  );
};
