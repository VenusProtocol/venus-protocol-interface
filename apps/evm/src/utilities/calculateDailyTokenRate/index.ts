import BigNumber from 'bignumber.js';

import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { SECONDS_PER_DAY } from 'constants/time';

export interface CalculateDailyTokenRateInput {
  rateMantissa: BigNumber | string | number;
  decimals?: number;
  blocksPerDay?: number;
}

export const calculateDailyTokenRate = ({
  blocksPerDay,
  rateMantissa,
  decimals = COMPOUND_DECIMALS,
}: CalculateDailyTokenRateInput) =>
  new BigNumber(rateMantissa)
    // Convert mantissa to tokens
    .div(10 ** decimals)
    // Convert to daily rate
    .multipliedBy(blocksPerDay || SECONDS_PER_DAY)
    .dp(decimals);
