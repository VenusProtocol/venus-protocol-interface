import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS, COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';

const calculateApy = (ratePerBlockMantissa: BigNumber | string | number) => {
  const dailyDistributedTokens = new BigNumber(ratePerBlockMantissa)
    .div(COMPOUND_MANTISSA)
    .multipliedBy(BLOCKS_PER_DAY)
    .dp(COMPOUND_DECIMALS);

  const apyPercentage = dailyDistributedTokens
    .plus(1)
    .pow(DAYS_PER_YEAR - 1)
    .minus(1)
    .dp(COMPOUND_DECIMALS)
    // Convert to percentage
    .multipliedBy(100);

  return {
    dailyDistributedTokens,
    apyPercentage,
  };
};

export default calculateApy;
