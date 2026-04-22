import { AccountHealthBar, HealthFactorPill, LabeledInlineContent, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';

export interface AccountHealthProps {
  pool: Pool;
  simulatedPool?: Pool;
}

export const AccountHealth: React.FC<AccountHealthProps> = ({ pool, simulatedPool }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-3 grow">
      <AccountHealthBar
        borrowBalanceCents={
          simulatedPool?.userBorrowBalanceCents?.toNumber() ??
          pool.userBorrowBalanceCents?.toNumber() ??
          0
        }
        borrowLimitCents={
          simulatedPool?.userBorrowLimitCents?.toNumber() ??
          pool.userBorrowLimitCents?.toNumber() ??
          0
        }
        liquidationThresholdCents={
          simulatedPool?.userLiquidationThresholdCents?.toNumber() ??
          pool.userLiquidationThresholdCents?.toNumber() ??
          0
        }
        borrowBalanceProtectedCents={
          simulatedPool?.userBorrowBalanceProtectedCents?.toNumber() ??
          pool.userBorrowBalanceProtectedCents?.toNumber()
        }
        userHasProtectionModeAssets={(simulatedPool ?? pool).userHasProtectionModeAssets}
      />

      <LabeledInlineContent
        label={t('yieldPlus.positions.status.healthFactor.label')}
        tooltip={t('yieldPlus.positions.status.healthFactor.tooltip')}
      >
        <ValueUpdate
          original={
            <HealthFactorPill factor={pool.userHealthFactor || 0} showLabel={!simulatedPool} />
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
