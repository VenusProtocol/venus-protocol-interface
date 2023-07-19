import BigNumber from 'bignumber.js';

import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';

export interface CalculateApyInput {
  dailyDistributedTokens: BigNumber;
}

const calculateApy = ({ dailyDistributedTokens }: CalculateApyInput) =>
  dailyDistributedTokens
    .plus(1)
    .pow(DAYS_PER_YEAR - 1)
    .minus(1)
    // Convert to percentage
    .multipliedBy(100)
    .dp(COMPOUND_DECIMALS);

export default calculateApy;
