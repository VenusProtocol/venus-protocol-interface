import BigNumber from 'bignumber.js';
import { Asset } from 'types';

import getCombinedDistributionApys from './getCombinedDistributionApys';

export const calculateYearlyInterests = ({
  balance,
  interestPercentage,
}: {
  balance: BigNumber;
  interestPercentage: BigNumber;
}) => {
  if (!interestPercentage.isFinite()) {
    return new BigNumber(0);
  }

  return balance.multipliedBy(interestPercentage).dividedBy(100);
};

export const calculateYearlyEarningsForAsset = ({
  asset,
  isAssetIsolated,
}: {
  asset: Asset;
  isAssetIsolated: boolean;
}) => {
  let totalSupplyApyPercentage = asset.supplyApyPercentage;
  let totalBorrowApyPercentage = asset.borrowApyPercentage;

  // HOTFIX: ignore distribution APYs for isolated assets until we get a solution to calculate
  // accurate distribution APYs for them
  if (!isAssetIsolated) {
    // Combine supply and borrow APYs with distribution APYs
    const combinedDistributionApys = getCombinedDistributionApys({ asset });

    totalSupplyApyPercentage = asset.supplyApyPercentage.plus(
      combinedDistributionApys.supplyApyPercentage,
    );

    totalBorrowApyPercentage = asset.borrowApyPercentage.minus(
      combinedDistributionApys.borrowApyPercentage,
    );
  }

  // Calculate yearly earnings
  const supplyYearlyEarningsCents = calculateYearlyInterests({
    balance: asset.userSupplyBalanceCents,
    interestPercentage: totalSupplyApyPercentage,
  });
  const borrowYearlyInterestsCents = calculateYearlyInterests({
    balance: asset.userBorrowBalanceCents,
    interestPercentage: totalBorrowApyPercentage,
  });

  return supplyYearlyEarningsCents.minus(borrowYearlyInterestsCents).dp(0);
};

export const calculateYearlyEarningsForAssets = ({
  assets,
  areAssetsIsolated,
}: {
  assets: Asset[];
  areAssetsIsolated: boolean;
}) => {
  // We use the yearly earnings to calculate the daily earnings the net APY
  let yearlyEarningsCents: BigNumber | undefined;

  assets.forEach(asset => {
    if (!yearlyEarningsCents) {
      yearlyEarningsCents = new BigNumber(0);
    }

    const assetYearlyEarningsCents = calculateYearlyEarningsForAsset({
      asset,
      isAssetIsolated: areAssetsIsolated,
    });

    yearlyEarningsCents = yearlyEarningsCents.plus(assetYearlyEarningsCents);
  });

  return yearlyEarningsCents;
};
