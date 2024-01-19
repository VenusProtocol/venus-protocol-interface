import BigNumber from 'bignumber.js';

import { DAYS_PER_YEAR } from 'constants/daysPerYear';

import calculateApy from '../calculateApy';

export const convertAprToApy = ({ aprBips }: { aprBips: string }) => {
  // Convert bips to daily rate
  const dailyRate = new BigNumber(aprBips).div(10000).div(DAYS_PER_YEAR);
  // Convert daily rate to APY
  return calculateApy({ dailyRate });
};
