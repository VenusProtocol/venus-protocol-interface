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
  let userLiquidationThresholdCents = new BigNumber(0);

  assets.forEach(asset => {
    userBorrowBalanceCents = userBorrowBalanceCents.plus(asset.userBorrowBalanceCents);
    userSupplyBalanceCents = userSupplyBalanceCents.plus(asset.userSupplyBalanceCents);

    if (asset.isCollateralOfUser) {
      const borrowLimitContribution = asset.userSupplyBalanceCents.multipliedBy(
        asset.userCollateralFactor,
      );
      const liqThresholdContribution = asset.userSupplyBalanceCents.multipliedBy(
        asset.userLiquidationThresholdPercentage / 100,
      );

      userBorrowLimitCents = userBorrowLimitCents.plus(borrowLimitContribution);
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

  const userHealthFactor = calculateHealthFactor({
    liquidationThresholdCents: userLiquidationThresholdCents.toNumber(),
    borrowBalanceCents: userBorrowBalanceCents.toNumber(),
  });

  return {
    userBorrowBalanceCents,
    userSupplyBalanceCents,
    userBorrowLimitCents,
    userLiquidationThresholdCents,
    userHealthFactor,
    userYearlyEarningsCents,
  } satisfies Partial<Pool>;
};
