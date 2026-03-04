import { AccountHealthBar, HealthFactorPill, LabeledInlineContent } from 'components';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';

export interface AccountHealthProps {
  pool: Pool;
}

export const AccountHealth: React.FC<AccountHealthProps> = ({ pool }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-3">
      <AccountHealthBar
        borrowBalanceCents={
          pool.userBorrowBalanceCents ? pool.userBorrowBalanceCents.toNumber() : 0
        }
        borrowLimitCents={pool.userBorrowLimitCents ? pool.userBorrowLimitCents.toNumber() : 0}
      />

      <LabeledInlineContent
        label={t('yieldPlus.positions.status.healthFactor.label')}
        tooltip={t('yieldPlus.positions.status.healthFactor.tooltip')}
      >
        <HealthFactorPill factor={pool.userHealthFactor || 0} showLabel />
      </LabeledInlineContent>
    </div>
  );
};
