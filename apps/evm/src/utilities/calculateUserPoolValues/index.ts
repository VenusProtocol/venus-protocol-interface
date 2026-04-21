import BigNumber from 'bignumber.js';

import type { Asset, Pool } from 'types';
import {
  calculateHealthFactor,
  calculateYearlyEarningsForAssets,
  calculateYearlyInterests,
} from 'utilities';

export const calculateUserPoolValues = ({
  assets,
  userVaiBorrowBalanceCents,
  vaiBorrowAprPercentage,
}: {
  assets: Asset[];
  userVaiBorrowBalanceCents?: BigNumber;
  vaiBorrowAprPercentage?: BigNumber;
}) => {
  // Calculate user-specific properties
  let userBorrowBalanceCents = new BigNumber(0);
  let userSupplyBalanceCents = new BigNumber(0);
  let userBorrowLimitCents = new BigNumber(0);
  let userBorrowLimitProtectedCents = new BigNumber(0);
  let userBorrowBalanceProtectedCents = new BigNumber(0);
  let userLiquidationThresholdCents = new BigNumber(0);

  assets.forEach(asset => {
    userBorrowBalanceCents = userBorrowBalanceCents.plus(asset.userBorrowBalanceCents);
    userSupplyBalanceCents = userSupplyBalanceCents.plus(asset.userSupplyBalanceCents);
    userBorrowBalanceProtectedCents = userBorrowBalanceProtectedCents.plus(
      asset.userBorrowBalanceProtectedCents,
    );

    // TODO: remove debug logs
    if (asset.isProtectionModeEnabled && asset.isCollateralOfUser) {
      console.log(
        `[PROTECTION] Asset ${asset.vToken.underlyingToken.symbol} collateral: supplyTokens=${asset.userSupplyBalanceTokens.toFixed(4)}, supplyBalanceCents(spot)=$${asset.userSupplyBalanceCents.dividedBy(100).toFixed(2)}, supplyBalanceProtectedCents=$${asset.userSupplyBalanceProtectedCents.dividedBy(100).toFixed(2)}, CF=${asset.userCollateralFactor}, LT=${asset.userLiquidationThresholdPercentage}%`,
      );
    }
    if (asset.isProtectionModeEnabled && !asset.userBorrowBalanceCents.isZero()) {
      console.log(
        `[PROTECTION] Asset ${asset.vToken.underlyingToken.symbol} debt: borrowTokens=${asset.userBorrowBalanceTokens.toFixed(4)}, borrowBalanceCents(spot)=$${asset.userBorrowBalanceCents.dividedBy(100).toFixed(2)}, borrowBalanceProtectedCents=$${asset.userBorrowBalanceProtectedCents.dividedBy(100).toFixed(2)}`,
      );
    }

    if (asset.isCollateralOfUser) {
      const borrowLimitContribution = asset.userSupplyBalanceCents.multipliedBy(
        asset.userCollateralFactor,
      );
      const protectedBorrowLimitContribution =
        asset.userSupplyBalanceProtectedCents.multipliedBy(asset.userCollateralFactor);
      const liqThresholdContribution = asset.userSupplyBalanceCents.multipliedBy(
        asset.userLiquidationThresholdPercentage / 100,
      );

      userBorrowLimitCents = userBorrowLimitCents.plus(borrowLimitContribution);
      userBorrowLimitProtectedCents = userBorrowLimitProtectedCents.plus(
        protectedBorrowLimitContribution,
      );
      userLiquidationThresholdCents = userLiquidationThresholdCents.plus(liqThresholdContribution);
    }
  });

  let userYearlyEarningsCents = calculateYearlyEarningsForAssets({
    assets,
  });

  if (userVaiBorrowBalanceCents && vaiBorrowAprPercentage && userYearlyEarningsCents) {
    userBorrowBalanceCents = userBorrowBalanceCents.plus(userVaiBorrowBalanceCents);

    const userYearlyVaiInterestsCents = calculateYearlyInterests({
      balance: userVaiBorrowBalanceCents,
      interestPercentage: vaiBorrowAprPercentage,
    });

    userYearlyEarningsCents = userYearlyEarningsCents.minus(userYearlyVaiInterestsCents).dp(0);
  }

  const userHealthFactor = calculateHealthFactor({
    liquidationThresholdCents: userLiquidationThresholdCents.toNumber(),
    borrowBalanceCents: userBorrowBalanceCents.toNumber(),
  });

  // TODO: remove debug logs
  if (userBorrowBalanceCents.isGreaterThan(0)) {
    console.log(
      `[HF_DEBUG] healthFactor=${userHealthFactor}, liqThreshold(spot)=$${userLiquidationThresholdCents.dividedBy(100).toFixed(2)}, borrowBalance(spot)=$${userBorrowBalanceCents.dividedBy(100).toFixed(2)}, borrowLimit(spot)=$${userBorrowLimitCents.dividedBy(100).toFixed(2)}, borrowLimit(protected)=$${userBorrowLimitProtectedCents.dividedBy(100).toFixed(2)}, borrowBalance(protected)=$${userBorrowBalanceProtectedCents.dividedBy(100).toFixed(2)}`,
    );
  }

  return {
    userBorrowBalanceCents,
    userSupplyBalanceCents,
    userBorrowLimitCents,
    userBorrowLimitProtectedCents,
    userBorrowBalanceProtectedCents,
    userLiquidationThresholdCents,
    userHealthFactor,
    userYearlyEarningsCents,
  } satisfies Partial<Pool>;
};
