import BigNumber from 'bignumber.js';

import { Asset } from 'types';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';

export const calculateYearlyEarningsForAsset = ({ asset }: { asset: Asset }) => {
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

  return supplyYearlyEarningsCents.plus(borrowYearlyInterestsCents);
};

export const calculateYearlyEarningsForAssets = ({
  assets,
  isXvsEnabled,
  dailyXvsDistributionInterestsCents,
}: {
  assets: Asset[];
  isXvsEnabled: boolean;
  dailyXvsDistributionInterestsCents: BigNumber;
}) => {
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

  if (yearlyEarningsCents && isXvsEnabled) {
    const yearlyXvsDistributionInterestsCents =
      dailyXvsDistributionInterestsCents.multipliedBy(DAYS_PER_YEAR);

    yearlyEarningsCents = yearlyEarningsCents.plus(yearlyXvsDistributionInterestsCents);
  }

  return yearlyEarningsCents;
};
