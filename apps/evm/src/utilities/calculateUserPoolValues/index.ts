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

    if (asset.isCollateralOfUser) {
      const borrowLimitContribution = asset.userSupplyBalanceCents.multipliedBy(
        asset.userCollateralFactor,
      );
      const protectedBorrowLimitContribution = asset.userSupplyBalanceProtectedCents.multipliedBy(
        asset.userCollateralFactor,
      );
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

    userYearlyEarningsCents = userYearlyEarningsCents.minus(userYearlyVaiInterestsCents);
  }

  // Health factor uses spot prices (userBorrowBalanceCents and userLiquidationThresholdCents are
  // already spot-based since userSupplyBalanceCents and userBorrowBalanceCents use tokenPriceCents)
  const userHealthFactor = calculateHealthFactor({
    liquidationThresholdCents: userLiquidationThresholdCents.toNumber(),
    borrowBalanceCents: userBorrowBalanceCents.toNumber(),
  });

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
