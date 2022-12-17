import BigNumber from 'bignumber.js';
import { Asset } from 'types';

export const calculateYearlyEarningsForAsset = ({
  asset,
  includeXvs,
}: {
  asset: Asset;
  includeXvs: boolean;
}) => {
  const assetBorrowBalanceCents = asset.borrowBalance
    .multipliedBy(asset.tokenPriceDollars)
    .multipliedBy(100);
  const assetSupplyBalanceCents = asset.supplyBalance
    .multipliedBy(asset.tokenPriceDollars)
    .multipliedBy(100);

  const supplyYearlyEarningsCents = assetSupplyBalanceCents.multipliedBy(
    asset.supplyApy.dividedBy(100),
  );
  // Note that borrowYearlyEarningsCents will always be negative (or 0), since
  // the borrow APY is expressed with a negative percentage)
  const borrowYearlyEarningsCents = assetBorrowBalanceCents.multipliedBy(
    asset.borrowApy.dividedBy(100),
  );

  const yearlyEarningsCents = supplyYearlyEarningsCents.plus(borrowYearlyEarningsCents);

  if (!includeXvs || !asset.xvsSupplyApr.isFinite() || !asset.xvsBorrowApr.isFinite()) {
    return yearlyEarningsCents;
  }

  // Add earnings from XVS distribution
  const supplyYearlyXvsDistributionEarningsCents = supplyYearlyEarningsCents.multipliedBy(
    asset.xvsSupplyApr.dividedBy(100),
  );

  const borrowYearlyXvsDistributionEarningsCents = borrowYearlyEarningsCents.multipliedBy(
    asset.xvsBorrowApr.dividedBy(100),
  );

  return yearlyEarningsCents
    .plus(supplyYearlyXvsDistributionEarningsCents)
    .plus(borrowYearlyXvsDistributionEarningsCents);
};

export const calculateYearlyEarningsForAssets = ({
  assets,
  includeXvs,
}: {
  assets: Asset[];
  includeXvs: boolean;
}) => {
  // We use the yearly earnings to calculate the daily earnings the net APY
  let yearlyEarningsCents: BigNumber | undefined;

  assets.forEach(asset => {
    if (!yearlyEarningsCents) {
      yearlyEarningsCents = new BigNumber(0);
    }

    const assetYearlyEarningsCents = calculateYearlyEarningsForAsset({
      asset,
      includeXvs,
    });

    yearlyEarningsCents = yearlyEarningsCents.plus(assetYearlyEarningsCents);
  });

  return yearlyEarningsCents;
};
