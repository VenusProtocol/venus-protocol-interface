import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { HealthFactorPill, LabeledInlineContent, ValueUpdate } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, Swap, TokenAction } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import useGetValues from './useGetValues';

export interface AccountDataProps {
  asset: Asset;
  pool: Pool;
  action: TokenAction;
  amountTokens: BigNumber;
  isUsingSwap?: boolean;
  swap?: Swap;
  className?: string;
}

export const AccountData: React.FC<AccountDataProps> = ({
  asset,
  pool,
  action,
  amountTokens,
  isUsingSwap = false,
  swap,
  className,
}) => {
  const { t } = useTranslation();

  const {
    poolUserHealthFactor,
    poolUserDailyEarningsCents,
    hypotheticalPoolUserHealthFactor,
    hypotheticalPoolUserDailyEarningsCents,
    hypotheticalPoolUserBorrowBalanceCents,
    hypotheticalAssetUserSupplyBalanceCents,
    hypotheticalAssetUserBorrowBalanceCents,
  } = useGetValues({ asset, pool, swap, amountTokens, action, isUsingSwap });

  const shouldShowHealthFactor =
    pool.userBorrowBalanceCents?.isGreaterThan(0) ||
    hypotheticalPoolUserBorrowBalanceCents?.isGreaterThan(0);

  const shouldShowSupplyBalance =
    action === 'withdraw' &&
    (asset.userSupplyBalanceCents.isGreaterThan(0) ||
      !!hypotheticalAssetUserSupplyBalanceCents?.isGreaterThan(0));

  const shouldShowRepayBalance =
    action === 'repay' &&
    (asset.userBorrowBalanceCents.isGreaterThan(0) ||
      !!hypotheticalAssetUserBorrowBalanceCents?.isGreaterThan(0));

  return (
    <div className={cn('space-y-2', className)}>
      {shouldShowHealthFactor && (
        <LabeledInlineContent
          label={t('accountData.healthFactor.label')}
          tooltip={t('accountData.healthFactor.tooltip')}
        >
          <ValueUpdate
            original={
              poolUserHealthFactor !== undefined ? (
                <HealthFactorPill
                  factor={poolUserHealthFactor}
                  showLabel={hypotheticalPoolUserHealthFactor === undefined}
                />
              ) : (
                PLACEHOLDER_KEY
              )
            }
            update={
              hypotheticalPoolUserHealthFactor !== undefined ? (
                <HealthFactorPill factor={hypotheticalPoolUserHealthFactor} showLabel />
              ) : undefined
            }
          />
        </LabeledInlineContent>
      )}

      <LabeledInlineContent label={t('accountData.dailyEarnings.label')}>
        <ValueUpdate
          original={formatCentsToReadableValue({ value: poolUserDailyEarningsCents })}
          update={
            hypotheticalPoolUserDailyEarningsCents &&
            formatCentsToReadableValue({ value: hypotheticalPoolUserDailyEarningsCents })
          }
        />
      </LabeledInlineContent>

      {shouldShowSupplyBalance && (
        <LabeledInlineContent label={t('accountData.supplyBalance.label')}>
          <ValueUpdate
            original={formatCentsToReadableValue({ value: asset.userSupplyBalanceCents })}
            update={
              hypotheticalAssetUserSupplyBalanceCents &&
              formatCentsToReadableValue({ value: hypotheticalAssetUserSupplyBalanceCents })
            }
          />
        </LabeledInlineContent>
      )}

      {shouldShowRepayBalance && (
        <LabeledInlineContent label={t('accountData.borrowBalance.label')}>
          <ValueUpdate
            original={formatCentsToReadableValue({ value: asset.userBorrowBalanceCents })}
            update={
              hypotheticalAssetUserBorrowBalanceCents &&
              formatCentsToReadableValue({ value: hypotheticalAssetUserBorrowBalanceCents })
            }
          />
        </LabeledInlineContent>
      )}
    </div>
  );
};
