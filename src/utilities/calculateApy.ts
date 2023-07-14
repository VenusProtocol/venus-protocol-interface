import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';

export interface CalculateApyInput {
  ratePerBlockMantissa: BigNumber | string | number;
  decimals?: number;
}

const calculateApy = ({
  ratePerBlockMantissa,
  decimals = COMPOUND_DECIMALS,
}: CalculateApyInput) => {
  const dailyDistributedTokens = new BigNumber(ratePerBlockMantissa)
    .div(new BigNumber(10).pow(decimals))
    .multipliedBy(BLOCKS_PER_DAY)
    .dp(decimals);

  const apyPercentage = dailyDistributedTokens
    .plus(1)
    .pow(DAYS_PER_YEAR - 1)
    .minus(1)
    .dp(decimals)
    // Convert to percentage
    .multipliedBy(100);

  return {
    dailyDistributedTokens,
    apyPercentage,
  };
};

export default calculateApy;
