import { cn } from '@venusprotocol/ui';
import { AccountHealthBar, HealthFactorPill, LabeledInlineContent, ValueUpdate } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useTranslation } from 'libs/translations';
import { memo } from 'react';
import type { Pool } from 'types';
import { calculateDailyEarningsCents, formatCentsToReadableValue } from 'utilities';

const formatToReadableDailyEarnings = ({
  yearlyEarningsCents,
}: { yearlyEarningsCents: BigNumber | undefined }) => {
  const dailyEarningsCents =
    yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents);

  return formatCentsToReadableValue({ value: dailyEarningsCents });
};

const MemoizedAccountHealthBar = memo(AccountHealthBar);

export interface AccountDataProps {
  pool: Pool;
  simulatedPool?: Pool;
  className?: string;
}

export const AccountData: React.FC<AccountDataProps> = ({ pool, simulatedPool, className }) => {
  const { t } = useTranslation();

  const refPool = simulatedPool ?? pool;

  const shouldShowHealth =
    !!pool.userBorrowBalanceCents?.isGreaterThan(0) ||
    !!simulatedPool?.userBorrowLimitCents?.isGreaterThan(0);

  return (
    <div className={cn('space-y-2', className)}>
      {shouldShowHealth && (
        <div className="space-y-4">
          <MemoizedAccountHealthBar
            borrowBalanceCents={refPool.userBorrowBalanceCents?.toNumber()}
            borrowLimitCents={refPool.userBorrowLimitCents?.toNumber()}
          />

          <LabeledInlineContent
            label={t('accountData.healthFactor.label')}
            tooltip={t('accountData.healthFactor.tooltip')}
          >
            <ValueUpdate
              original={
                pool.userHealthFactor !== undefined ? (
                  <HealthFactorPill
                    factor={pool.userHealthFactor}
                    showLabel={simulatedPool?.userHealthFactor === undefined}
                  />
                ) : (
                  PLACEHOLDER_KEY
                )
              }
              update={
                simulatedPool?.userHealthFactor !== undefined ? (
                  <HealthFactorPill factor={simulatedPool.userHealthFactor} showLabel />
                ) : undefined
              }
            />
          </LabeledInlineContent>
        </div>
      )}

      <LabeledInlineContent label={t('accountData.dailyEarnings.label')}>
        <ValueUpdate
          original={formatToReadableDailyEarnings({
            yearlyEarningsCents: pool.userYearlyEarningsCents,
          })}
          update={
            simulatedPool?.userYearlyEarningsCents &&
            formatToReadableDailyEarnings({
              yearlyEarningsCents: simulatedPool.userYearlyEarningsCents,
            })
          }
        />
      </LabeledInlineContent>
    </div>
  );
};
