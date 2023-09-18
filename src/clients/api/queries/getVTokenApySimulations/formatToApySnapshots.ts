import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';

import { VTokenApySnapshot } from './types';

export interface FormatToApySnapshotsInput {
  supplyRates: Awaited<
    ReturnType<
      (ContractTypeByName<'jumpRateModel'> | ContractTypeByName<'jumpRateModelV2'>)['getSupplyRate']
    >
  >[];
  borrowRates: Awaited<
    ReturnType<
      (ContractTypeByName<'jumpRateModel'> | ContractTypeByName<'jumpRateModelV2'>)['getBorrowRate']
    >
  >[];
}

const formatToApySnapshots = ({ supplyRates, borrowRates }: FormatToApySnapshotsInput) => {
  let utilizationRatePercentage = 0;

  const apySimulations: VTokenApySnapshot[] = supplyRates.map((supplyRate, index) => {
    const supplyBase = new BigNumber(supplyRate.toString())
      .div(COMPOUND_MANTISSA)
      .times(BLOCKS_PER_DAY)
      .plus(1);
    const supplyApyPercentage = supplyBase
      .pow(DAYS_PER_YEAR - 1)
      .minus(1)
      .times(100)
      .toNumber();

    const borrowBase = new BigNumber(borrowRates[index].toString())
      .div(COMPOUND_MANTISSA)
      .times(BLOCKS_PER_DAY)
      .plus(1);
    const borrowApyPercentage = borrowBase
      .pow(DAYS_PER_YEAR - 1)
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
