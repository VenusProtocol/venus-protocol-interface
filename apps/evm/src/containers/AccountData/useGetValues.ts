import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { Asset, Pool, Swap, TokenAction } from 'types';
import {
  areTokensEqual,
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculateHealthFactor,
  calculateYearlyEarningsForAssets,
  convertTokensToMantissa,
  getSwapToTokenAmountReceivedTokens,
} from 'utilities';

import { useGetHypotheticalUserPrimeApys } from 'hooks/useGetHypotheticalUserPrimeApys';

export interface UseGetValuesInput {
  asset: Asset;
  pool: Pool;
  action: TokenAction;
  amountTokens: BigNumber;
  isUsingSwap: boolean;
  swap?: Swap;
}

export interface UseGetValuesOutput {
  poolUserHealthFactor: number | undefined;
  poolUserDailyEarningsCents: BigNumber | undefined;
  hypotheticalPoolUserHealthFactor: number | undefined;
  hypotheticalPoolUserDailyEarningsCents: BigNumber | undefined;
  hypotheticalPoolUserBorrowBalanceCents: BigNumber | undefined;
  hypotheticalAssetUserSupplyBalanceCents: BigNumber | undefined;
  hypotheticalAssetUserBorrowBalanceCents: BigNumber | undefined;
}

const useGetValues = ({
  asset,
  pool,
  swap,
  action,
  isUsingSwap,
  amountTokens,
}: UseGetValuesInput): UseGetValuesOutput => {
  const toTokenAmountTokens = useMemo(() => {
    if (isUsingSwap) {
      return (
        getSwapToTokenAmountReceivedTokens(swap)?.swapToTokenAmountReceivedTokens ??
        new BigNumber(0)
      );
    }

    return amountTokens;
  }, [swap, amountTokens, isUsingSwap]);

  const hypotheticalUserPrimeApys = useGetHypotheticalUserPrimeApys({
    asset,
    action,
    toTokenAmountTokens,
  });

  return useMemo(() => {
    const poolUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: pool.assets,
    });

    const poolUserDailyEarningsCents =
      poolUserYearlyEarningsCents && calculateDailyEarningsCents(poolUserYearlyEarningsCents);

    const poolUserHealthFactor =
      pool.userBorrowLimitCents &&
      pool.userBorrowBalanceCents &&
      calculateHealthFactor({
        borrowLimitCents: pool.userBorrowLimitCents.toNumber(),
        borrowBalanceCents: pool.userBorrowBalanceCents.toNumber(),
      });

    const returnValues: UseGetValuesOutput = {
      poolUserDailyEarningsCents,
      poolUserHealthFactor,
      hypotheticalPoolUserHealthFactor: undefined,
      hypotheticalPoolUserDailyEarningsCents: undefined,
      hypotheticalPoolUserBorrowBalanceCents: undefined,
      hypotheticalAssetUserSupplyBalanceCents: undefined,
      hypotheticalAssetUserBorrowBalanceCents: undefined,
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
          amountMantissa: convertTokensToMantissa({
            value: toTokenAmountTokens,
            token: asset.vToken.underlyingToken,
          }),
          token: asset.vToken.underlyingToken,
          tokenPriceCents: asset.tokenPriceCents,
          collateralFactor: asset.collateralFactor,
        })
      : new BigNumber(0);

    let hypotheticalUserSupplyBalanceTokens: BigNumber | undefined;
    let hypotheticalUserBorrowBalanceTokens: BigNumber | undefined;
    let hypotheticalPoolUserBorrowLimitCents: BigNumber | undefined;

    if (action === 'supply') {
      hypotheticalUserSupplyBalanceTokens = asset.userSupplyBalanceTokens.plus(toTokenAmountTokens);

      hypotheticalPoolUserBorrowLimitCents = amountCollateralValueCents.plus(
        pool.userBorrowLimitCents,
      );
    } else if (action === 'withdraw') {
      hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.minus(toTokenAmountTokens);

      returnValues.hypotheticalAssetUserSupplyBalanceCents =
        hypotheticalUserSupplyBalanceTokens.multipliedBy(asset.tokenPriceCents);

      hypotheticalPoolUserBorrowLimitCents = pool.userBorrowLimitCents.minus(
        amountCollateralValueCents,
      );
    } else if (action === 'borrow') {
      hypotheticalUserBorrowBalanceTokens = asset.userBorrowBalanceTokens.plus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowBalanceCents = toTokenAmountTokens
        .multipliedBy(asset.tokenPriceCents)
        .plus(pool.userBorrowBalanceCents);
    } else if (action === 'repay') {
      hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.minus(toTokenAmountTokens);

      returnValues.hypotheticalAssetUserBorrowBalanceCents =
        hypotheticalUserBorrowBalanceTokens.multipliedBy(asset.tokenPriceCents);

      returnValues.hypotheticalPoolUserBorrowBalanceCents = pool.userBorrowBalanceCents.minus(
        toTokenAmountTokens.multipliedBy(asset.tokenPriceCents),
      );
    }

    const hypotheticalAssets = pool.assets.map(a => {
      if (!areTokensEqual(a.vToken, asset.vToken)) {
        return a;
      }

      const userSupplyBalanceTokens =
        hypotheticalUserSupplyBalanceTokens || asset.userSupplyBalanceTokens;
      const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(asset.tokenPriceCents);

      const userBorrowBalanceTokens =
        hypotheticalUserBorrowBalanceTokens || asset.userBorrowBalanceTokens;
      const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(asset.tokenPriceCents);

      // Include hypothetical Prime distributions
      const borrowTokenDistributions = a.borrowTokenDistributions.map(borrowDistribution => {
        if (
          borrowDistribution.type !== 'prime' ||
          !hypotheticalUserPrimeApys.borrowApy ||
          (action !== 'borrow' && action !== 'repay')
        ) {
          return borrowDistribution;
        }

        return {
          ...borrowDistribution,
          apyPercentage: hypotheticalUserPrimeApys.borrowApy,
        };
      });

      const supplyTokenDistributions = a.supplyTokenDistributions.map(supplyDistribution => {
        if (
          supplyDistribution.type !== 'prime' ||
          !hypotheticalUserPrimeApys.supplyApy ||
          (action !== 'supply' && action !== 'withdraw')
        ) {
          return supplyDistribution;
        }

        return {
          ...supplyDistribution,
          apyPercentage: hypotheticalUserPrimeApys.supplyApy,
        };
      });

      return {
        ...a,
        borrowTokenDistributions,
        supplyTokenDistributions,
        userSupplyBalanceTokens,
        userSupplyBalanceCents,
        userBorrowBalanceTokens,
        userBorrowBalanceCents,
      };
    });

    // Calculate hypothetical earnings
    const borrowBalanceCents = returnValues.hypotheticalPoolUserBorrowBalanceCents
      ? returnValues.hypotheticalPoolUserBorrowBalanceCents.toNumber()
      : pool.userBorrowBalanceCents.toNumber();

    const borrowLimitCents = hypotheticalPoolUserBorrowLimitCents
      ? hypotheticalPoolUserBorrowLimitCents.toNumber()
      : pool.userBorrowLimitCents.toNumber();

    const hypotheticalUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: hypotheticalAssets,
    });

    returnValues.hypotheticalPoolUserDailyEarningsCents =
      hypotheticalUserYearlyEarningsCents &&
      calculateDailyEarningsCents(hypotheticalUserYearlyEarningsCents);

    returnValues.hypotheticalPoolUserHealthFactor = calculateHealthFactor({
      borrowBalanceCents,
      borrowLimitCents,
    });

    return returnValues;
  }, [asset, pool, action, toTokenAmountTokens, hypotheticalUserPrimeApys]);
};

export default useGetValues;
