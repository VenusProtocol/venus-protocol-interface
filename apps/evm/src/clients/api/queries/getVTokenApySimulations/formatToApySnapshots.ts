import BigNumber from 'bignumber.js';

import type { JumpRateModel, JumpRateModelV2 } from 'libs/contracts';
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
  supplyRates: Awaited<ReturnType<(JumpRateModel | JumpRateModelV2)['getSupplyRate']>>[];
  borrowRates: Awaited<ReturnType<(JumpRateModel | JumpRateModelV2)['getBorrowRate']>>[];
  blocksPerDay?: number;
};

const formatToApySnapshots = ({
  blocksPerDay,
  supplyRates,
  borrowRates,
}: FormatToApySnapshotsInput) => {
  let utilizationRatePercentage = 0;

  const apySimulations: VTokenApySnapshot[] = supplyRates.map((unformattedSupplyRate, index) => {
    const supplyApyPercentage = calculateApy({
      rate: new BigNumber(unformattedSupplyRate.toString()),
      blocksPerDay,
    });

    const borrowApyPercentage = calculateApy({
      rate: new BigNumber(borrowRates[index].toString()),
      blocksPerDay,
    });

    utilizationRatePercentage += 1;

    return {
      utilizationRatePercentage,
      borrowApyPercentage,
      supplyApyPercentage,
    };
  });

  return apySimulations;
};

export default formatToApySnapshots;
