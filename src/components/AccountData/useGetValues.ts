import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Pool, Swap } from 'types';
import {
  areTokensEqual,
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculatePercentage,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  convertWeiToTokens,
} from 'utilities';

export interface UseGetValuesInput {
  asset: Asset;
  pool: Pool;
  action: 'supply' | 'withdraw' | 'repay' | 'borrow';
  amountTokens: BigNumber;
  swap?: Swap;
}

export interface UseGetValuesOutput {
  poolUserBorrowLimitUsedPercentage: number | undefined;
  poolUserDailyEarningsCents: number | undefined;
  hypotheticalUserSupplyBalanceTokens: BigNumber | undefined;
  hypotheticalPoolUserBorrowBalanceCents: number | undefined;
  hypotheticalUserBorrowBalanceTokens: BigNumber | undefined;
  hypotheticalPoolUserBorrowLimitCents: number | undefined;
  hypotheticalPoolUserBorrowLimitUsedPercentage: number | undefined;
  hypotheticalPoolUserDailyEarningsCents: number | undefined;
}

const useGetValues = ({
  asset,
  pool,
  swap,
  action,
  amountTokens,
}: UseGetValuesInput): UseGetValuesOutput => {
  const toTokenAmountTokens = useMemo(() => {
    if (swap) {
      return convertWeiToTokens({
        valueWei:
          swap.direction === 'exactAmountIn'
            ? swap.expectedToTokenAmountReceivedWei
            : swap.toTokenAmountReceivedWei,
        token: swap.toToken,
      });
    }

    return amountTokens;
  }, [swap, amountTokens]);

  return useMemo(() => {
    const poolUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: pool.assets,
    });

    const poolUserDailyEarningsCents =
      poolUserYearlyEarningsCents !== undefined
        ? calculateDailyEarningsCents(poolUserYearlyEarningsCents).toNumber()
        : undefined;

    const poolUserBorrowLimitUsedPercentage =
      pool.userBorrowBalanceCents !== undefined && pool.userBorrowLimitCents !== undefined
        ? calculatePercentage({
            numerator: pool.userBorrowBalanceCents.toNumber(),
            denominator: pool.userBorrowLimitCents.toNumber(),
          })
        : undefined;

    const returnValues: UseGetValuesOutput = {
      poolUserBorrowLimitUsedPercentage,
      poolUserDailyEarningsCents,
      hypotheticalUserSupplyBalanceTokens: undefined,
      hypotheticalUserBorrowBalanceTokens: undefined,
      hypotheticalPoolUserBorrowBalanceCents: undefined,
      hypotheticalPoolUserBorrowLimitCents: undefined,
      hypotheticalPoolUserBorrowLimitUsedPercentage: undefined,
      hypotheticalPoolUserDailyEarningsCents: undefined,
    };

    const isImpossibleWithdrawAction =
      action === 'withdraw' && asset.userSupplyBalanceTokens.isLessThan(toTokenAmountTokens);
    const isImpossibleRepayAction =
      action === 'repay' && asset.userBorrowBalanceTokens.isLessThan(toTokenAmountTokens);

    if (
      toTokenAmountTokens.isEqualTo(0) ||
      isImpossibleWithdrawAction ||
      isImpossibleRepayAction ||
      // Check we have sufficient data
      pool.userBorrowBalanceCents === undefined ||
      pool.userBorrowLimitCents === undefined ||
      pool.userSupplyBalanceCents === undefined
    ) {
      return returnValues;
    }

    const amountCollateralValueCents = asset.isCollateralOfUser
      ? calculateCollateralValue({
          amountWei: convertTokensToWei({
            value: toTokenAmountTokens,
            token: asset.vToken.underlyingToken,
          }),
          token: asset.vToken.underlyingToken,
          tokenPriceCents: asset.tokenPriceCents,
          collateralFactor: asset.collateralFactor,
        })
      : new BigNumber(0);

    if (action === 'supply') {
      returnValues.hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.plus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowLimitCents = amountCollateralValueCents
        .plus(pool.userBorrowLimitCents)
        .toNumber();
    } else if (action === 'withdraw') {
      returnValues.hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.minus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowLimitCents = pool.userBorrowLimitCents
        .minus(amountCollateralValueCents)
        .toNumber();
    } else if (action === 'borrow') {
      returnValues.hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.plus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowBalanceCents = toTokenAmountTokens
        .multipliedBy(asset.tokenPriceCents)
        .plus(pool.userBorrowBalanceCents)
        .toNumber();
    } else if (action === 'repay') {
      returnValues.hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.minus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowBalanceCents = pool.userBorrowBalanceCents
        .minus(toTokenAmountTokens.multipliedBy(asset.tokenPriceCents))
        .toNumber();
    }

    const hypotheticalAssets = pool.assets.map(a => {
      if (areTokensEqual(a.vToken, asset.vToken)) {
        const userSupplyBalanceTokens =
          returnValues.hypotheticalUserSupplyBalanceTokens || asset.userSupplyBalanceTokens;
        const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(asset.tokenPriceCents);

        const userBorrowBalanceTokens =
          returnValues.hypotheticalUserBorrowBalanceTokens || asset.userBorrowBalanceTokens;
        const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(asset.tokenPriceCents);

        return {
          ...a,
          userSupplyBalanceTokens,
          userSupplyBalanceCents,
          userBorrowBalanceTokens,
          userBorrowBalanceCents,
        };
      }

      return a;
    });

    // Calculate hypothetical earnings
    returnValues.hypotheticalPoolUserBorrowLimitUsedPercentage = calculatePercentage({
      numerator:
        returnValues.hypotheticalPoolUserBorrowBalanceCents ||
        pool.userBorrowBalanceCents.toNumber(),
      denominator:
        returnValues.hypotheticalPoolUserBorrowLimitCents || pool.userBorrowLimitCents.toNumber(),
    });

    const hypotheticalUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: hypotheticalAssets,
    });

    returnValues.hypotheticalPoolUserDailyEarningsCents =
      hypotheticalUserYearlyEarningsCents &&
      calculateDailyEarningsCents(hypotheticalUserYearlyEarningsCents).dp(0).toNumber();

    return returnValues;
  }, [asset, pool, action, toTokenAmountTokens]);
};

export default useGetValues;
