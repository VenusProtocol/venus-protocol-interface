import { cn } from '@venusprotocol/ui';
import { AccountHealthBar, HealthFactorPill, LabeledInlineContent, ValueUpdate } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import { memo } from 'react';
import type { Pool } from 'types';

const MemoizedAccountHealthBar = memo(AccountHealthBar);

export interface AccountPoolHealthProps {
  pool: Pool;
  simulatedPool?: Pool;
  className?: string;
}

export const AccountPoolHealth: React.FC<AccountPoolHealthProps> = ({
  pool,
  simulatedPool,
  className,
}) => {
  const { t } = useTranslation();

  const refPool = simulatedPool ?? pool;

  return (
    <div className={cn('space-y-4', className)}>
      <MemoizedAccountHealthBar
        borrowBalanceCents={refPool.userBorrowBalanceCents?.toNumber()}
        borrowBalanceProtectedCents={refPool.userBorrowBalanceProtectedCents?.toNumber()}
        borrowLimitCents={refPool.userBorrowLimitCents?.toNumber()}
        borrowLimitProtectedCents={refPool.userBorrowLimitProtectedCents?.toNumber()}
        liquidationThresholdCents={refPool.userLiquidationThresholdCents?.toNumber()}
      />

      <LabeledInlineContent
        label={t('accountHealth.healthFactor.label')}
        tooltip={t('accountHealth.healthFactor.tooltip')}
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
  );
};
