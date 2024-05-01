import BigNumber from 'bignumber.js';

import { DAYS_PER_YEAR } from 'constants/time';

import { calculateYearlyPercentageRate } from '../calculateYearlyPercentageRate';

export const convertAprBipsToApy = ({ aprBips }: { aprBips: string }) => {
  // Convert bips to daily rate
  const dailyPercentageRate = new BigNumber(aprBips).div(10000).div(DAYS_PER_YEAR);
  // Convert daily rate to APY
  return calculateYearlyPercentageRate({ dailyPercentageRate });
};
