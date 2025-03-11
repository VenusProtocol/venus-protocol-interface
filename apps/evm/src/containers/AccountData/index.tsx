import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { BorrowBalanceAccountHealth, LabeledInlineContent, ValueUpdate } from 'components';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, Swap, TokenAction } from 'types';
import { formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';
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
    poolUserBorrowLimitUsedPercentage,
    poolUserDailyEarningsCents,
    hypotheticalUserSupplyBalanceTokens,
    hypotheticalUserBorrowBalanceTokens,
    hypotheticalPoolUserBorrowBalanceCents,
    hypotheticalPoolUserBorrowLimitCents,
    hypotheticalPoolUserBorrowLimitUsedPercentage,
    hypotheticalPoolUserDailyEarningsCents,
  } = useGetValues({ asset, pool, swap, amountTokens, action, isUsingSwap });

  return (
    <div className={cn('space-y-4', className)}>
      <BorrowBalanceAccountHealth
        borrowBalanceCents={
          hypotheticalPoolUserBorrowBalanceCents?.toNumber() ??
          pool.userBorrowBalanceCents?.toNumber()
        }
        borrowLimitCents={
          hypotheticalPoolUserBorrowLimitCents?.toNumber() ?? pool.userBorrowLimitCents?.toNumber()
        }
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <div className="space-y-2">
        {action === 'supply' || action === 'withdraw' ? (
          <LabeledInlineContent
            label={t('accountData.supplyBalance', {
              tokenSymbol: asset.vToken.underlyingToken.symbol,
            })}
          >
            <ValueUpdate
              original={asset.userSupplyBalanceTokens}
              update={hypotheticalUserSupplyBalanceTokens}
              format={(value: BigNumber | undefined) =>
                formatTokensToReadableValue({
                  value,
                  token: asset.vToken.underlyingToken,
                  addSymbol: false,
                })
              }
            />
          </LabeledInlineContent>
        ) : (
          <LabeledInlineContent
            label={t('accountData.borrowBalance', {
              tokenSymbol: asset.vToken.underlyingToken.symbol,
            })}
          >
            <ValueUpdate
              original={asset.userBorrowBalanceTokens}
              update={hypotheticalUserBorrowBalanceTokens}
              positiveDirection="desc"
              format={(value: BigNumber | undefined) =>
                formatTokensToReadableValue({
                  value,
                  token: asset.vToken.underlyingToken,
                  addSymbol: false,
                })
              }
            />
          </LabeledInlineContent>
        )}

        {action === 'supply' || action === 'withdraw' ? (
          <LabeledInlineContent label={t('accountData.borrowLimit')}>
            <ValueUpdate
              original={pool.userBorrowLimitCents?.toNumber()}
              update={hypotheticalPoolUserBorrowLimitCents?.toNumber()}
            />
          </LabeledInlineContent>
        ) : (
          <LabeledInlineContent label={t('accountData.borrowLimitUsed')}>
            <ValueUpdate
              original={poolUserBorrowLimitUsedPercentage}
              update={hypotheticalPoolUserBorrowLimitUsedPercentage}
              positiveDirection="desc"
              format={formatPercentageToReadableValue}
            />
          </LabeledInlineContent>
        )}

        <LabeledInlineContent label={t('accountData.dailyEarnings')}>
          <ValueUpdate
            original={poolUserDailyEarningsCents}
            update={hypotheticalPoolUserDailyEarningsCents}
          />
        </LabeledInlineContent>
      </div>
    </div>
  );
};
