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

  // Spot-based values for health factor (liquidation uses spot prices)
  let spotBorrowBalanceCents = new BigNumber(0);
  let spotLiquidationThresholdCents = new BigNumber(0);

  assets.forEach(asset => {
    userBorrowBalanceCents = userBorrowBalanceCents.plus(asset.userBorrowBalanceCents);
    userSupplyBalanceCents = userSupplyBalanceCents.plus(asset.userSupplyBalanceCents);

    const spotSupplyBalanceCents = asset.userSupplyBalanceTokens.multipliedBy(
      asset.tokenPriceCents,
    );
    const spotBorrowBalance = asset.userBorrowBalanceTokens.multipliedBy(asset.tokenPriceCents);
    spotBorrowBalanceCents = spotBorrowBalanceCents.plus(spotBorrowBalance);

    if (asset.isCollateralOfUser) {
      const borrowLimitContribution = asset.userSupplyBalanceCents.multipliedBy(
        asset.userCollateralFactor,
      );
      const liqThresholdContribution = spotSupplyBalanceCents.multipliedBy(
        asset.userLiquidationThresholdPercentage / 100,
      );

      userBorrowLimitCents = userBorrowLimitCents.plus(borrowLimitContribution);
      userLiquidationThresholdCents = userLiquidationThresholdCents.plus(liqThresholdContribution);
      spotLiquidationThresholdCents = spotLiquidationThresholdCents.plus(liqThresholdContribution);
    }
  });

  let userYearlyEarningsCents = calculateYearlyEarningsForAssets({
    assets,
  });

  if (userVaiBorrowBalanceCents && vaiBorrowAprPercentage && userYearlyEarningsCents) {
    userBorrowBalanceCents = userBorrowBalanceCents.plus(userVaiBorrowBalanceCents);
    spotBorrowBalanceCents = spotBorrowBalanceCents.plus(userVaiBorrowBalanceCents);

    const userYearlyVaiInterestsCents = calculateYearlyInterests({
      balance: userVaiBorrowBalanceCents,
      interestPercentage: vaiBorrowAprPercentage,
    });

    userYearlyEarningsCents = userYearlyEarningsCents.minus(userYearlyVaiInterestsCents);
  }

  // Health factor uses spot prices (matching contract LT path / liquidation)
  const userHealthFactor = calculateHealthFactor({
    liquidationThresholdCents: spotLiquidationThresholdCents.toNumber(),
    borrowBalanceCents: spotBorrowBalanceCents.toNumber(),
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
