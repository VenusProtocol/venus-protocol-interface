import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Pool, Swap, TokenAction } from 'types';
import {
  areTokensEqual,
  calculateCollateralValue,
  calculateDailyEarningsCents,
  calculatePercentage,
  calculateYearlyEarningsForAssets,
  convertTokensToWei,
  convertWeiToTokens,
} from 'utilities';

import { useGetHypotheticalUserPrimeApys } from './useGetHypotheticalUserPrimeApys';

export interface UseGetValuesInput {
  asset: Asset;
  pool: Pool;
  action: TokenAction;
  amountTokens: BigNumber;
  isUsingSwap: boolean;
  swap?: Swap;
}

export interface UseGetValuesOutput {
  poolUserBorrowLimitUsedPercentage: number | undefined;
  poolUserDailyEarningsCents: BigNumber | undefined;
  hypotheticalUserSupplyBalanceTokens: BigNumber | undefined;
  hypotheticalPoolUserBorrowBalanceCents: BigNumber | undefined;
  hypotheticalUserBorrowBalanceTokens: BigNumber | undefined;
  hypotheticalPoolUserBorrowLimitCents: BigNumber | undefined;
  hypotheticalPoolUserBorrowLimitUsedPercentage: number | undefined;
  hypotheticalPoolUserDailyEarningsCents: BigNumber | undefined;
  hypotheticalAssetSupplyPrimeApyPercentage: BigNumber | undefined;
  hypotheticalAssetBorrowPrimeApyPercentage: BigNumber | undefined;
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
      return swap
        ? convertWeiToTokens({
            valueWei:
              swap.direction === 'exactAmountIn'
                ? swap.expectedToTokenAmountReceivedWei
                : swap.toTokenAmountReceivedWei,
            token: swap.toToken,
          })
        : new BigNumber(0);
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
      poolUserYearlyEarningsCents !== undefined
        ? calculateDailyEarningsCents(poolUserYearlyEarningsCents)
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
      hypotheticalAssetSupplyPrimeApyPercentage: hypotheticalUserPrimeApys?.supplyApy,
      hypotheticalAssetBorrowPrimeApyPercentage: hypotheticalUserPrimeApys?.borrowApy,
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

      returnValues.hypotheticalPoolUserBorrowLimitCents = amountCollateralValueCents.plus(
        pool.userBorrowLimitCents,
      );
    } else if (action === 'withdraw') {
      returnValues.hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.minus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowLimitCents = pool.userBorrowLimitCents.minus(
        amountCollateralValueCents,
      );
    } else if (action === 'borrow') {
      returnValues.hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.plus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowBalanceCents = toTokenAmountTokens
        .multipliedBy(asset.tokenPriceCents)
        .plus(pool.userBorrowBalanceCents);
    } else if (action === 'repay') {
      returnValues.hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.minus(toTokenAmountTokens);

      returnValues.hypotheticalPoolUserBorrowBalanceCents = pool.userBorrowBalanceCents.minus(
        toTokenAmountTokens.multipliedBy(asset.tokenPriceCents),
      );
    }

    const hypotheticalAssets = pool.assets.map(a => {
      if (!areTokensEqual(a.vToken, asset.vToken)) {
        return a;
      }

      const userSupplyBalanceTokens =
        returnValues.hypotheticalUserSupplyBalanceTokens || asset.userSupplyBalanceTokens;
      const userSupplyBalanceCents = userSupplyBalanceTokens.multipliedBy(asset.tokenPriceCents);

      const userBorrowBalanceTokens =
        returnValues.hypotheticalUserBorrowBalanceTokens || asset.userBorrowBalanceTokens;
      const userBorrowBalanceCents = userBorrowBalanceTokens.multipliedBy(asset.tokenPriceCents);

      // Include hypothetical Prime distributions
      const borrowDistributions = a.borrowDistributions.map(borrowDistribution => {
        if (
          borrowDistribution.type !== 'prime' ||
          !hypotheticalUserPrimeApys?.borrowApy ||
          (action !== 'borrow' && action !== 'repay')
        ) {
          return borrowDistribution;
        }

        return {
          ...borrowDistribution,
          apyPercentage: hypotheticalUserPrimeApys.borrowApy,
        };
      });

      const supplyDistributions = a.supplyDistributions.map(borrowDistribution => {
        if (
          borrowDistribution.type !== 'prime' ||
          !hypotheticalUserPrimeApys?.supplyApy ||
          (action !== 'borrow' && action !== 'repay')
        ) {
          return borrowDistribution;
        }

        return {
          ...borrowDistribution,
          apyPercentage: hypotheticalUserPrimeApys.supplyApy,
        };
      });

      return {
        ...a,
        borrowDistributions,
        supplyDistributions,
        userSupplyBalanceTokens,
        userSupplyBalanceCents,
        userBorrowBalanceTokens,
        userBorrowBalanceCents,
      };
    });

    // Calculate hypothetical earnings
    returnValues.hypotheticalPoolUserBorrowLimitUsedPercentage = calculatePercentage({
      numerator:
        returnValues.hypotheticalPoolUserBorrowBalanceCents?.toNumber() ||
        pool.userBorrowBalanceCents.toNumber(),
      denominator:
        returnValues.hypotheticalPoolUserBorrowLimitCents?.toNumber() ||
        pool.userBorrowLimitCents.toNumber(),
    });

    const hypotheticalUserYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: hypotheticalAssets,
    });

    returnValues.hypotheticalPoolUserDailyEarningsCents =
      hypotheticalUserYearlyEarningsCents &&
      calculateDailyEarningsCents(hypotheticalUserYearlyEarningsCents);

    return returnValues;
  }, [asset, pool, action, toTokenAmountTokens]);
};

export default useGetValues;
