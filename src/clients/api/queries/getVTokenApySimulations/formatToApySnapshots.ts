import BigNumber from 'bignumber.js';
import { JumpRateModel, JumpRateModelV2 } from 'packages/contracts';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';

import { VTokenApySnapshot } from './types';

export interface FormatToApySnapshotsInput {
  blocksPerDay: number;
  supplyRates: Awaited<ReturnType<(JumpRateModel | JumpRateModelV2)['getSupplyRate']>>[];
  borrowRates: Awaited<ReturnType<(JumpRateModel | JumpRateModelV2)['getBorrowRate']>>[];
}

const formatToApySnapshots = ({
  blocksPerDay,
  supplyRates,
  borrowRates,
}: FormatToApySnapshotsInput) => {
  let utilizationRatePercentage = 0;

  const apySimulations: VTokenApySnapshot[] = supplyRates.map((supplyRate, index) => {
    const supplyBase = new BigNumber(supplyRate.toString())
      .div(COMPOUND_MANTISSA)
      .times(blocksPerDay)
      .plus(1);
    const supplyApyPercentage = new BigNumber(supplyBase.toNumber() ** (DAYS_PER_YEAR - 1))
      .minus(1)
      .times(100)
      .toNumber();

    const borrowBase = new BigNumber(borrowRates[index].toString())
      .div(COMPOUND_MANTISSA)
      .times(blocksPerDay)
      .plus(1);
    const borrowApyPercentage = new BigNumber(borrowBase.toNumber() ** (DAYS_PER_YEAR - 1))
      .minus(1)
      .times(100)
      .toNumber();

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
