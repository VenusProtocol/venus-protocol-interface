import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { Asset, Pool, Swap, TokenAction } from 'types';
import {
  areTokensEqual,
  calculateDailyEarningsCents,
  calculateHealthFactor,
  calculateYearlyEarningsForAssets,
  convertMantissaToTokens,
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
  poolUserDailyEarningsCents: BigNumber | undefined;
  hypotheticalPoolUserHealthFactor: number | undefined;
  hypotheticalPoolUserDailyEarningsCents: BigNumber | undefined;
  hypotheticalPoolUserBorrowBalanceCents: BigNumber | undefined;
  hypotheticalPoolUserBorrowLimitCents: BigNumber | undefined;
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

    const returnValues: UseGetValuesOutput = {
      poolUserDailyEarningsCents,
      hypotheticalPoolUserHealthFactor: undefined,
      hypotheticalPoolUserDailyEarningsCents: undefined,
      hypotheticalPoolUserBorrowBalanceCents: undefined,
      hypotheticalPoolUserBorrowLimitCents: undefined,
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
      pool.userLiquidationThresholdCents === undefined ||
      pool.userSupplyBalanceCents === undefined ||
      pool.userBorrowLimitCents === undefined
    ) {
      return returnValues;
    }

    const toTokenAmountCents = convertMantissaToTokens({
      value: convertTokensToMantissa({
        value: toTokenAmountTokens,
        token: asset.vToken.underlyingToken,
      }),
      token: asset.vToken.underlyingToken,
    }).times(asset.tokenPriceCents);

    const amountLiquidationThresholdValueCents = asset.isCollateralOfUser
      ? toTokenAmountCents.times(asset.userLiquidationThresholdPercentage / 100)
      : new BigNumber(0);

    const amountCollateralValueCents = asset.isCollateralOfUser
      ? toTokenAmountCents.times(asset.userCollateralFactor)
      : new BigNumber(0);

    let hypotheticalUserSupplyBalanceTokens: BigNumber | undefined;
    let hypotheticalUserBorrowBalanceTokens: BigNumber | undefined;
    let hypotheticalPoolUserLiquidationThresholdCents: BigNumber | undefined;

    if (action === 'supply') {
      hypotheticalUserSupplyBalanceTokens = asset.userSupplyBalanceTokens.plus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowLimitCents = amountCollateralValueCents.plus(
        pool.userBorrowLimitCents,
      );

      hypotheticalPoolUserLiquidationThresholdCents = pool.userLiquidationThresholdCents.plus(
        amountLiquidationThresholdValueCents,
      );
    } else if (action === 'withdraw') {
      hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.minus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowLimitCents = pool.userBorrowLimitCents.minus(
        amountCollateralValueCents,
      );

      returnValues.hypotheticalAssetUserSupplyBalanceCents =
        hypotheticalUserSupplyBalanceTokens.multipliedBy(asset.tokenPriceCents);

      hypotheticalPoolUserLiquidationThresholdCents = pool.userLiquidationThresholdCents.minus(
        amountLiquidationThresholdValueCents,
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

    const liquidationThresholdCents = hypotheticalPoolUserLiquidationThresholdCents
      ? hypotheticalPoolUserLiquidationThresholdCents.toNumber()
      : pool.userLiquidationThresholdCents.toNumber();

    const hypotheticalUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: hypotheticalAssets,
    });

    returnValues.hypotheticalPoolUserDailyEarningsCents =
      hypotheticalUserYearlyEarningsCents &&
      calculateDailyEarningsCents(hypotheticalUserYearlyEarningsCents);

    returnValues.hypotheticalPoolUserHealthFactor = calculateHealthFactor({
      borrowBalanceCents,
      liquidationThresholdCents,
    });

    return returnValues;
  }, [asset, pool, action, toTokenAmountTokens, hypotheticalUserPrimeApys]);
};

export default useGetValues;
