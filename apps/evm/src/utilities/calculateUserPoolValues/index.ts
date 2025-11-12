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
      userBorrowLimitCents = userBorrowLimitCents.plus(
        asset.userSupplyBalanceCents.multipliedBy(asset.userCollateralFactor),
      );

      userLiquidationThresholdCents = userLiquidationThresholdCents.plus(
        asset.userSupplyBalanceCents.multipliedBy(asset.userLiquidationThresholdPercentage / 100),
      );
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

  return {
    userBorrowBalanceCents,
    userSupplyBalanceCents,
    userBorrowLimitCents,
    userLiquidationThresholdCents,
    userHealthFactor,
    userYearlyEarningsCents,
  } satisfies Partial<Pool>;
};
