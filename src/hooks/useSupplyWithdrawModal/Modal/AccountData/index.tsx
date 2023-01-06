/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  BorrowBalanceAccountHealth,
  Delimiter,
  LabeledInlineContent,
  LabeledInlineContentProps,
  ValueUpdate,
} from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import {
  areTokensEqual,
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  formatTokensToReadableValue,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';

import { useStyles } from '../styles';

interface AccountDataProps {
  asset: Asset;
  pool: Pool;
  tokenInfo: LabeledInlineContentProps[];
  action: 'supply' | 'withdraw';
  amount: BigNumber;
  isAmountValid: boolean;
}

export const AccountData: React.FC<AccountDataProps> = ({
  asset,
  pool,
  tokenInfo,
  action,
  amount,
  isAmountValid,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const calculateNewBalance = (valueA: BigNumber, valueB: BigNumber) => {
    if (action === 'supply') {
      return valueA.plus(valueB);
    }

    const returnValue = valueA.minus(valueB);

    return returnValue.isLessThanOrEqualTo(0) ? undefined : returnValue;
  };

  const hypotheticalUserSupplyBalanceTokens =
    isAmountValid && amount
      ? calculateNewBalance(asset.userSupplyBalanceTokens, amount)
      : undefined;

  const hypotheticalBorrowLimitCents = useMemo(() => {
    let updatedBorrowLimitCents;

    if (asset?.tokenPriceDollars && isAmountValid) {
      const collateralValueCents = calculateCollateralValue({
        amountWei: convertTokensToWei({ value: amount, token: asset.vToken.underlyingToken }),
        token: asset.vToken.underlyingToken,
        tokenPriceDollars: asset.tokenPriceDollars,
        collateralFactor: asset.collateralFactor,
      }).times(100);

      const temp = calculateNewBalance(
        new BigNumber(pool.userBorrowLimitCents || 0),
        collateralValueCents,
      );
      updatedBorrowLimitCents = temp && BigNumber.maximum(temp, 0);
    }

    return updatedBorrowLimitCents;
  }, [amount, asset.vToken.underlyingToken, pool.userBorrowLimitCents]);

  const [dailyEarningsCents, hypotheticalDailyEarningCents] = useMemo(() => {
    let hypotheticalDailyEarningCentsValue;

    const yearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: pool.assets,
    });

    const dailyEarningsCentsValue =
      yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents);

    // Modify asset with hypotheticalBalance
    if (isAmountValid) {
      const hypotheticalAssets = pool.assets.map(a => {
        if (areTokensEqual(a.vToken, asset.vToken)) {
          const hypotheticalAssetSupplyBalanceTokens =
            calculateNewBalance(asset.userSupplyBalanceTokens, amount) || new BigNumber(0);

          return {
            ...a,
            userSupplyBalanceTokens: hypotheticalAssetSupplyBalanceTokens,
          };
        }

        return a;
      });

      const hypotheticalYearlyEarningsCents = calculateYearlyEarningsForAssets({
        assets: hypotheticalAssets,
      });

      hypotheticalDailyEarningCentsValue =
        hypotheticalYearlyEarningsCents &&
        calculateDailyEarningsCents(hypotheticalYearlyEarningsCents);
    }

    return [dailyEarningsCentsValue, hypotheticalDailyEarningCentsValue];
  }, [amount, isAmountValid, asset, pool.assets]);

  return (
    <>
      {tokenInfo.map((info, index) => (
        <LabeledInlineContent
          css={styles.getRow({ isLast: index === tokenInfo.length - 1 })}
          className="info-row"
          {...info}
          key={info.label}
        />
      ))}

      <Delimiter css={styles.getRow({ isLast: true })} />

      <BorrowBalanceAccountHealth
        css={styles.getRow({ isLast: true })}
        borrowBalanceCents={pool.userBorrowBalanceCents}
        borrowLimitCents={hypotheticalBorrowLimitCents?.toNumber() || pool.userBorrowLimitCents}
        safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
      />

      <LabeledInlineContent
        label={t('supplyWithdraw.supplyBalance', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        })}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        <ValueUpdate
          original={asset.userSupplyBalanceTokens}
          update={hypotheticalUserSupplyBalanceTokens}
          format={(value: BigNumber | undefined) =>
            formatTokensToReadableValue({
              value,
              token: asset.vToken.underlyingToken,
              minimizeDecimals: true,
              addSymbol: false,
            })
          }
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('supplyWithdraw.borrowLimit')}
        css={styles.getRow({ isLast: false })}
        className="info-row"
      >
        <ValueUpdate
          original={new BigNumber(pool.userBorrowLimitCents || 0)}
          update={hypotheticalBorrowLimitCents}
        />
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('supplyWithdraw.dailyEarnings')}
        css={styles.getRow({ isLast: true })}
        className="info-row"
      >
        <ValueUpdate original={dailyEarningsCents} update={hypotheticalDailyEarningCents} />
      </LabeledInlineContent>
    </>
  );
};
