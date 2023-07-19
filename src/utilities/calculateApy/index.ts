import BigNumber from 'bignumber.js';

import { DAYS_PER_YEAR } from 'constants/daysPerYear';

export interface CalculateApyInput {
  dailyDistributedTokens: BigNumber;
  decimals: number;
}

const calculateApy = ({ dailyDistributedTokens, decimals }: CalculateApyInput) =>
  dailyDistributedTokens
    .plus(1)
    .pow(DAYS_PER_YEAR - 1)
    .minus(1)
    .dp(decimals)
    // Convert to percentage
    .multipliedBy(100);

export default calculateApy;
