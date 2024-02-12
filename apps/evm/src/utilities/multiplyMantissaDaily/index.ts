import BigNumber from 'bignumber.js';

import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';

export interface MultiplyMantissaDailyInput {
  blocksPerDay: number;
  mantissa: BigNumber | string | number;
  decimals?: number;
}

const multiplyMantissaDaily = ({
  blocksPerDay,
  mantissa,
  decimals = COMPOUND_DECIMALS,
}: MultiplyMantissaDailyInput) =>
  new BigNumber(mantissa)
    .div(10 ** decimals)
    .multipliedBy(blocksPerDay)
    .dp(decimals);

export default multiplyMantissaDaily;
