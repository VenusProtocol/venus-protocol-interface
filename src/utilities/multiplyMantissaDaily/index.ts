import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';

export interface MultiplyMantissaDailyInput {
  mantissa: BigNumber | string | number;
  decimals?: number;
}

export const multiplyMantissaDaily = ({
  mantissa,
  decimals = COMPOUND_DECIMALS,
}: MultiplyMantissaDailyInput) =>
  new BigNumber(mantissa)
    .div(new BigNumber(10).pow(decimals))
    .multipliedBy(BLOCKS_PER_DAY)
    .dp(decimals);
