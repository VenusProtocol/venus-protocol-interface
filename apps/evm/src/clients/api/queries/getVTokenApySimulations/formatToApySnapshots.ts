import BigNumber from 'bignumber.js';

import { calculateDailyTokenRate, calculateYearlyPercentageRate } from 'utilities';
import type { VTokenApySnapshot } from './types';

const calculateApy = ({ rate, blocksPerDay }: { rate: BigNumber; blocksPerDay?: number }) => {
  const dailyPercentageRate = calculateDailyTokenRate({
    rateMantissa: rate,
    blocksPerDay: blocksPerDay,
  });

  return calculateYearlyPercentageRate({
    dailyPercentageRate,
  });
};

export type FormatToApySnapshotsInput = {
  supplyRatePercentages: bigint[];
  borrowRatePercentages: bigint[];
  blocksPerDay?: number;
};

const formatToApySnapshots = ({
  blocksPerDay,
  supplyRatePercentages,
  borrowRatePercentages,
}: FormatToApySnapshotsInput) => {
  let utilizationRatePercentage = 0;

  const apySimulations: VTokenApySnapshot[] = supplyRatePercentages.map(
    (unformattedSupplyRate, index) => {
      const supplyApyPercentage = calculateApy({
        rate: new BigNumber(unformattedSupplyRate.toString()),
        blocksPerDay,
      }).toNumber();

      const borrowApyPercentage = calculateApy({
        rate: new BigNumber(borrowRatePercentages[index].toString()),
        blocksPerDay,
      }).toNumber();

      utilizationRatePercentage += 1;

      return {
        utilizationRatePercentage,
        borrowApyPercentage,
        supplyApyPercentage,
      };
    },
  );

  return apySimulations;
};

export default formatToApySnapshots;
