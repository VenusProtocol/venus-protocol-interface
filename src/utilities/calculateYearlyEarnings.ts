import { Asset } from 'types';
import BigNumber from 'bignumber.js';

/**
 * Takes an asset, a supply balance (in wei of that asset) and a borrow balance (in wei of that asset)
 * and returns the resulting daily earnings (in dollar cents, rounded to the cent)
 * Daily Earnings calculation
 *
 * @param {asset: Asset, supplyBalance: BigNumber, borrowBalance: BigNumber } argument
 * @returns BigNumber of daily earnings (in dollar cents, rounded to the cent)
 */
export const calculateYearlyEarningsCents = ({
  asset,
  isXvsEnabled,
  yearlyEarningsCents = new BigNumber(0),
}: {
  asset: Asset;
  isXvsEnabled: boolean;
  yearlyEarningsCents?: BigNumber;
}) => {
  const assetBorrowBalanceCents = asset.borrowBalance
    .multipliedBy(asset.tokenPrice)
    .multipliedBy(100);
  const assetSupplyBalanceCents = asset.supplyBalance
    .multipliedBy(asset.tokenPrice)
    .multipliedBy(100);

  const supplyYearlyEarningsCents = assetSupplyBalanceCents.multipliedBy(
    asset.supplyApy.dividedBy(100),
  );
  // Note that borrowYearlyInterests will always be negative (or 0), since
  // the borrow APY is expressed with a negative percentage)
  const borrowYearlyInterestsCents = assetBorrowBalanceCents.multipliedBy(
    asset.borrowApy.dividedBy(100),
  );

  let totalYearlyEarningsCents = yearlyEarningsCents.plus(
    supplyYearlyEarningsCents.plus(borrowYearlyInterestsCents),
  );
  // Add XVS distribution earnings if enabled
  if (isXvsEnabled) {
    const supplyDistributionYearlyEarnings = assetSupplyBalanceCents.multipliedBy(
      asset.xvsSupplyApy.dividedBy(100),
    );
    const borrowDistributionYearlyEarnings = assetBorrowBalanceCents.multipliedBy(
      asset.xvsBorrowApy.dividedBy(100),
    );

    totalYearlyEarningsCents = totalYearlyEarningsCents
      .plus(supplyDistributionYearlyEarnings)
      .plus(borrowDistributionYearlyEarnings);
  }
  return totalYearlyEarningsCents;
};

/**
 * Takes an array of assets, a supply balance (in wei of that asset) and a borrow balance (in wei of that asset)
 * and returns the resulting daily earnings (in dollar cents, rounded to the cent)
 * Daily Earnings calculation
 *
 * @param {assets: Asset[], supplyBalance: BigNumber, borrowBalance: BigNumber } argument
 * @returns BigNumber of daily earnings (in dollar cents, rounded to the cent)
 */
export const calculateYearlyEarningsForAssets = ({
  assets,
  isXvsEnabled,
}: {
  assets: Asset[];
  isXvsEnabled: boolean;
}) => {
  // We use the yearly earnings to calculate the daily earnings the net APY
  let yearlyEarningsCents: BigNumber | undefined;
  assets.forEach(asset => {
    if (!yearlyEarningsCents) {
      yearlyEarningsCents = new BigNumber(0);
    }
    const assetYearlyEarningsCents = calculateYearlyEarningsCents({
      asset,
      isXvsEnabled,
      yearlyEarningsCents,
    });
    yearlyEarningsCents = assetYearlyEarningsCents;
  });
  return yearlyEarningsCents;
};
