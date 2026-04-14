import { cn } from '@venusprotocol/ui';
import { useMemo } from 'react';

import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import type { InstitutionalVault } from 'types';
import { VaultStatus } from 'types';

import { StepIcon } from './StepIcon';
import { getCurrentStatusIndex } from './getCurrentStatusIndex';
import { getStepStatus } from './getStepStatus';

interface StepDateRange {
  start: Date;
  end?: Date;
}

interface TimelineStep {
  title: string;
  dateRange?: StepDateRange;
  statusKey: VaultStatus;
}

interface TimelineTooltipsProps {
  vault: InstitutionalVault;
  className?: string;
}

export const TimelineTooltips: React.FC<TimelineTooltipsProps> = ({ vault, className }) => {
  const { t } = useTranslation();
  const now = useNow();

  const currentStatusIndex = getCurrentStatusIndex(vault, now.getTime());

  const hasPendingPeriod = vault.vaultDeploymentDate?.getTime() === vault.openEndDate?.getTime();

  const steps = useMemo(() => {
    const allSteps: TimelineStep[] = [
      {
        title: t('vault.modals.overview.institutionalTimeline.depositPeriod'),
        dateRange:
          vault.vaultDeploymentDate && vault.openEndDate
            ? { start: vault.vaultDeploymentDate, end: vault.openEndDate }
            : undefined,
        statusKey: VaultStatus.Deposit,
      },
      ...(hasPendingPeriod
        ? [
            {
              title: t('vault.modals.overview.institutionalTimeline.estimatedPendingPeriod'),
              dateRange:
                vault.vaultDeploymentDate && vault.openEndDate
                  ? { start: vault.vaultDeploymentDate, end: vault.openEndDate }
                  : undefined,
              statusKey: VaultStatus.Pending,
            },
          ]
        : []),
      {
        title: t('vault.modals.overview.institutionalTimeline.estimatedEarningPeriod'),
        dateRange:
          vault.openEndDate && vault.maturityDate
            ? { start: vault.openEndDate, end: vault.maturityDate }
            : undefined,
        statusKey: VaultStatus.Earning,
      },
      {
        title: t('vault.modals.overview.institutionalTimeline.estimatedRepayingPeriod'),
        dateRange:
          vault.maturityDate && vault.settlementDate
            ? { start: vault.maturityDate, end: vault.settlementDate }
            : undefined,
        statusKey: VaultStatus.Repaying,
      },
      {
        title: t('vault.modals.overview.institutionalTimeline.claimPeriod'),
        dateRange: vault.settlementDate ? { start: vault.settlementDate } : undefined,
        statusKey: VaultStatus.Claim,
      },
    ];

    return allSteps;
  }, [t, vault, hasPendingPeriod]);

  const formatDate = (date: Date) => t('vault.modals.textualWithTime', { date });

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-col gap-2.5">
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStatusIndex);
          const isActive = status === 'on';

          return (
            <div key={step.statusKey} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <StepIcon status={status} />
                <span className={cn('text-b2r', isActive ? 'text-white' : 'text-light-grey')}>
                  {step.title}
                </span>
              </div>

              {step.dateRange && (
                <div className="pl-7">
                  <span className={cn('text-b2r', isActive ? 'text-white' : 'text-light-grey')}>
                    {formatDate(step.dateRange.start)}
                    {step.dateRange.end ? ' — '.concat(formatDate(step.dateRange.end)) : ''}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
