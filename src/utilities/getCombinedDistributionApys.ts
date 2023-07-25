import BigNumber from 'bignumber.js';
import { Asset } from 'types';

const getCombinedDistributionApys = ({ asset }: { asset: Asset }) => ({
  supplyApyPercentage: asset.supplyDistributions.reduce(
    (acc, distribution) => acc.plus(distribution.apyPercentage),
    new BigNumber(0),
  ),
  borrowApyPercentage: asset.borrowDistributions.reduce(
    (acc, distribution) => acc.plus(distribution.apyPercentage),
    new BigNumber(0),
  ),
});

export default getCombinedDistributionApys;
