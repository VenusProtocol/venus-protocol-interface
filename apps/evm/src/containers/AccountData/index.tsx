import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { AccountHealthBar, HealthFactorPill, LabeledInlineContent, ValueUpdate } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useTranslation } from 'libs/translations';
import { memo } from 'react';
import type { Asset, Pool, Swap, TokenAction } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import useGetValues from './useGetValues';

const MemoizedAccountHealthBar = memo(AccountHealthBar);

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
    poolUserDailyEarningsCents,
    hypotheticalPoolUserHealthFactor,
    hypotheticalPoolUserDailyEarningsCents,
    hypotheticalPoolUserBorrowBalanceCents,
    hypotheticalAssetUserSupplyBalanceCents,
    hypotheticalAssetUserBorrowBalanceCents,
    hypotheticalPoolUserBorrowLimitCents,
  } = useGetValues({ asset, pool, swap, amountTokens, action, isUsingSwap });

  const shouldShowHealth =
    pool.userBorrowBalanceCents?.isGreaterThan(0) ||
    hypotheticalPoolUserBorrowBalanceCents?.isGreaterThan(0);

  const hypotheticalUserBorrowBalanceCents =
    hypotheticalPoolUserBorrowBalanceCents || pool.userBorrowBalanceCents;

  const hypotheticalUserBorrowLimitCents =
    hypotheticalPoolUserBorrowLimitCents || pool.userBorrowLimitCents;

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
      {shouldShowHealth && (
        <div className="space-y-4">
          <MemoizedAccountHealthBar
            borrowBalanceCents={hypotheticalUserBorrowBalanceCents?.toNumber()}
            borrowLimitCents={hypotheticalUserBorrowLimitCents?.toNumber()}
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
        </div>
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
