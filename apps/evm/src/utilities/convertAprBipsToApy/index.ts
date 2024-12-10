import { DAYS_PER_YEAR } from 'constants/time';

import { calculateYearlyPercentageRate } from '../calculateYearlyPercentageRate';

export const convertAprBipsToApy = ({ aprBips }: { aprBips: string }) => {
  // Convert bips to daily rate
  const dailyPercentageRate = +aprBips / 10000 / DAYS_PER_YEAR;
  // Convert daily rate to APY
  return calculateYearlyPercentageRate({ dailyPercentageRate });
};
