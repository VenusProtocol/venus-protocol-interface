import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Pool } from 'types';
import {
  areTokensEqual,
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculatePercentage,
  calculateYearlyEarningsForAssets,
  convertDollarsToCents,
  convertTokensToWei,
} from 'utilities';

export interface UseGetValuesInput {
  asset: Asset;
  pool: Pool;
  action: 'supply' | 'withdraw' | 'repay' | 'borrow';
  amountTokens: BigNumber;
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
  action,
  amountTokens,
}: UseGetValuesInput): UseGetValuesOutput =>
  useMemo(() => {
    const poolUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: pool.assets,
    });

    const poolUserDailyEarningsCents =
      poolUserYearlyEarningsCents !== undefined
        ? calculateDailyEarningsCents(poolUserYearlyEarningsCents).dp(0).toNumber()
        : undefined;

    const poolUserBorrowLimitUsedPercentage =
      pool.userBorrowBalanceCents &&
      pool.userBorrowLimitCents &&
      calculatePercentage({
        numerator: pool.userBorrowBalanceCents,
        denominator: pool.userBorrowLimitCents,
      });

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
      action === 'withdraw' && asset.userSupplyBalanceTokens.minus(amountTokens).isLessThan(0);
    const isImpossibleRepayAction =
      action === 'repay' && asset.userBorrowBalanceTokens.minus(amountTokens).isLessThan(0);

    if (
      amountTokens.isEqualTo(0) ||
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
      ? convertDollarsToCents(
          calculateCollateralValue({
            amountWei: convertTokensToWei({
              value: amountTokens,
              token: asset.vToken.underlyingToken,
            }),
            token: asset.vToken.underlyingToken,
            tokenPriceDollars: asset.tokenPriceDollars,
            collateralFactor: asset.collateralFactor,
          }),
        )
      : 0;

    if (action === 'supply') {
      returnValues.hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.plus(amountTokens);

      returnValues.hypotheticalPoolUserBorrowLimitCents =
        pool.userBorrowLimitCents + amountCollateralValueCents;
    } else if (action === 'withdraw') {
      returnValues.hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.minus(amountTokens);

      returnValues.hypotheticalPoolUserBorrowLimitCents =
        pool.userBorrowLimitCents - amountCollateralValueCents;
    } else if (action === 'borrow') {
      returnValues.hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.plus(amountTokens);

      returnValues.hypotheticalPoolUserBorrowBalanceCents =
        pool.userBorrowBalanceCents +
        convertDollarsToCents(amountTokens.multipliedBy(asset.tokenPriceDollars));
    } else if (action === 'repay') {
      returnValues.hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.minus(amountTokens);

      returnValues.hypotheticalPoolUserBorrowBalanceCents =
        pool.userBorrowBalanceCents -
        convertDollarsToCents(amountTokens.multipliedBy(asset.tokenPriceDollars));
    }

    const hypotheticalAssets = pool.assets.map(a => {
      if (areTokensEqual(a.vToken, asset.vToken)) {
        const userSupplyBalanceTokens =
          returnValues.hypotheticalUserSupplyBalanceTokens || asset.userSupplyBalanceTokens;
        const userSupplyBalanceCents = convertDollarsToCents(
          userSupplyBalanceTokens.multipliedBy(asset.tokenPriceDollars),
        );

        const userBorrowBalanceTokens =
          returnValues.hypotheticalUserBorrowBalanceTokens || asset.userBorrowBalanceTokens;
        const userBorrowBalanceCents = convertDollarsToCents(
          userBorrowBalanceTokens.multipliedBy(asset.tokenPriceDollars),
        );

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
      numerator: returnValues.hypotheticalPoolUserBorrowBalanceCents || pool.userBorrowBalanceCents,
      denominator: returnValues.hypotheticalPoolUserBorrowLimitCents || pool.userBorrowLimitCents,
    });

    const hypotheticalUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: hypotheticalAssets,
    });

    returnValues.hypotheticalPoolUserDailyEarningsCents =
      hypotheticalUserYearlyEarningsCents &&
      calculateDailyEarningsCents(hypotheticalUserYearlyEarningsCents).dp(0).toNumber();

    return returnValues;
  }, [
    {
      asset,
      pool,
      action,
      amountTokens,
    },
  ]);

export default useGetValues;
