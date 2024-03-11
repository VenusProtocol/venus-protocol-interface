import type BigNumber from 'bignumber.js';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, Swap, TokenAction } from 'types';
import { cn, formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';

import { Delimiter } from '../../components/Delimiter';
import { LabeledInlineContent } from '../../components/LabeledInlineContent';
import { BorrowBalanceAccountHealth } from '../../components/ProgressBar/AccountHealth';
import { ValueUpdate } from '../../components/ValueUpdate';
import useAssetInfo from './useAssetInfo';
import useGetValues from './useGetValues';

export interface AccountDataProps {
  asset: Asset;
  pool: Pool;
  action: TokenAction;
  amountTokens: BigNumber;
  showAssetInfo?: boolean;
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
  showAssetInfo = true,
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
    hypotheticalAssetBorrowPrimeApyPercentage,
    hypotheticalAssetSupplyPrimeApyPercentage,
  } = useGetValues({ asset, pool, swap, amountTokens, action, isUsingSwap });

  const assetInfo = useAssetInfo({
    asset,
    type: action === 'borrow' || action === 'repay' ? 'borrow' : 'supply',
    hypotheticalAssetBorrowPrimeApyPercentage,
    hypotheticalAssetSupplyPrimeApyPercentage,
  });

  return (
    <div className={cn('space-y-6', className)}>
      {showAssetInfo && (
        <>
          <div className="space-y-3">
            {assetInfo.map(row => (
              <LabeledInlineContent {...row} key={row.label} />
            ))}
          </div>

          <Delimiter />
        </>
      )}

      <BorrowBalanceAccountHealth
        borrowBalanceCents={pool.userBorrowBalanceCents?.toNumber()}
        borrowLimitCents={
          hypotheticalPoolUserBorrowLimitCents?.toNumber() ?? pool.userBorrowLimitCents?.toNumber()
        }
        hypotheticalBorrowBalanceCents={
          action === 'borrow' || action === 'repay'
            ? hypotheticalPoolUserBorrowBalanceCents?.toNumber()
            : undefined
        }
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <div className="space-y-3">
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
