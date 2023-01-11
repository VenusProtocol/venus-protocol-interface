import BigNumber from 'bignumber.js';
import { Asset } from 'types';

const getCombinedDistributionApys = ({ asset }: { asset: Asset }) =>
  asset.distributions.reduce(
    (acc, distribution) => ({
      supplyApyPercentage: acc.supplyApyPercentage.plus(distribution.supplyApyPercentage),
      borrowApyPercentage: acc.borrowApyPercentage.plus(distribution.borrowApyPercentage),
    }),
    {
      supplyApyPercentage: new BigNumber(0),
      borrowApyPercentage: new BigNumber(0),
    },
  );

export default getCombinedDistributionApys;
