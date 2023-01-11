import BigNumber from 'bignumber.js';
import { Asset } from 'types';

import getCombinedDistributionApys from './getCombinedDistributionApys';

export const calculateYearlyEarningsForAsset = ({ asset }: { asset: Asset }) => {
  // Combine supply and borrow APYs with distribution APYs
  const combinedDistributionApys = getCombinedDistributionApys({ asset });

  const totalSupplyApyPercentage = asset.supplyApyPercentage.plus(
    combinedDistributionApys.supplyApyPercentage,
  );
  const totalBorrowApyPercentage = asset.borrowApyPercentage.plus(
    combinedDistributionApys.borrowApyPercentage,
  );

  if (!totalSupplyApyPercentage.isFinite() || !totalBorrowApyPercentage.isFinite()) {
    return new BigNumber(0);
  }

  // Calculate yearly earnings
  const supplyYearlyEarningsCents = new BigNumber(asset.userSupplyBalanceCents)
    .multipliedBy(totalSupplyApyPercentage)
    .dividedBy(100);
  const borrowYearlyEarningsCents = new BigNumber(asset.userBorrowBalanceCents)
    .multipliedBy(totalBorrowApyPercentage)
    .dividedBy(100);

  return supplyYearlyEarningsCents.plus(borrowYearlyEarningsCents).dp(0);
};

export const calculateYearlyEarningsForAssets = ({ assets }: { assets: Asset[] }) => {
  // We use the yearly earnings to calculate the daily earnings the net APY
  let yearlyEarningsCents: BigNumber | undefined;

  assets.forEach(asset => {
    if (!yearlyEarningsCents) {
      yearlyEarningsCents = new BigNumber(0);
    }

    const assetYearlyEarningsCents = calculateYearlyEarningsForAsset({
      asset,
    });

    yearlyEarningsCents = yearlyEarningsCents.plus(assetYearlyEarningsCents);
  });

  return yearlyEarningsCents;
};
