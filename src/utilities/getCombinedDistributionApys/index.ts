import BigNumber from 'bignumber.js';
import { Asset } from 'types';

const getCombinedDistributionApys = ({ asset }: { asset: Asset }) => ({
  supplyApyPercentage: asset.supplyDistributions.reduce(
    (acc, distribution) =>
      // Filter out hypothetical prime APY as this is actual earnings the user receives
      distribution.type !== 'hypotheticalPrime' ? acc.plus(distribution.apyPercentage) : acc,
    new BigNumber(0),
  ),
  borrowApyPercentage: asset.borrowDistributions.reduce(
    (acc, distribution) =>
      // Filter out hypothetical prime APY as this is actual earnings the user receives
      distribution.type !== 'hypotheticalPrime' ? acc.plus(distribution.apyPercentage) : acc,
    new BigNumber(0),
  ),
});

export default getCombinedDistributionApys;
