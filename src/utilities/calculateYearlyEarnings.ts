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
  borrowBalanceCents,
  supplyBalanceCents = new BigNumber(0),
  yearlyEarningsCents = new BigNumber(0),
}: {
  asset: Asset;
  borrowBalanceCents: BigNumber;
  isXvsEnabled: boolean;
  supplyBalanceCents?: BigNumber;
  yearlyEarningsCents?: BigNumber;
}) => {
  let assetSupplyBalanceCents = supplyBalanceCents;
  let assetYearlyEarningsCents = yearlyEarningsCents;

  assetSupplyBalanceCents = assetSupplyBalanceCents.plus(
    asset.supplyBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
  );

  const supplyYearlyEarnings = assetSupplyBalanceCents.multipliedBy(asset.supplyApy).dividedBy(100);
  // Note that borrowYearlyInterests will always be negative (or 0), since
  // the borrow APY is expressed with a negative percentage)
  const borrowYearlyInterests = borrowBalanceCents.multipliedBy(asset.borrowApy).dividedBy(100);

  assetYearlyEarningsCents = assetYearlyEarningsCents.plus(
    supplyYearlyEarnings.plus(borrowYearlyInterests),
  );
  // Add XVS distribution earnings if enabled
  if (isXvsEnabled) {
    const supplyDistributionYearlyEarnings = assetSupplyBalanceCents
      .multipliedBy(asset.xvsSupplyApy)
      .dividedBy(100);
    const borrowDistributionYearlyEarnings = borrowBalanceCents
      .multipliedBy(asset.xvsBorrowApy)
      .dividedBy(100);

    assetYearlyEarningsCents = assetYearlyEarningsCents
      .plus(supplyDistributionYearlyEarnings)
      .plus(borrowDistributionYearlyEarnings);
  }
  return {
    yearlyEarningsCents: assetYearlyEarningsCents,
    supplyBalanceCents: assetSupplyBalanceCents,
  };
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
  borrowBalanceCents,
  isXvsEnabled,
}: {
  assets: Asset[];
  borrowBalanceCents: BigNumber;
  isXvsEnabled: boolean;
}) => {
  let supplyBalanceCents: BigNumber | undefined;

  // We use the yearly earnings to calculate the daily earnings the net APY
  let yearlyEarningsCents: BigNumber | undefined;
  assets.forEach(asset => {
    if (!supplyBalanceCents) {
      supplyBalanceCents = new BigNumber(0);
    }

    if (!yearlyEarningsCents) {
      yearlyEarningsCents = new BigNumber(0);
    }
    const {
      yearlyEarningsCents: assetYearlyEarningsCents,
      supplyBalanceCents: assetSupplyBalanceCents,
    } = calculateYearlyEarningsCents({
      asset,
      isXvsEnabled,
      borrowBalanceCents,
      supplyBalanceCents,
      yearlyEarningsCents,
    });
    yearlyEarningsCents = assetYearlyEarningsCents;
    supplyBalanceCents = assetSupplyBalanceCents;
  });
  return { yearlyEarningsCents, supplyBalanceCents };
};
