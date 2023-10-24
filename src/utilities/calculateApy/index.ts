import BigNumber from 'bignumber.js';

import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';

export interface CalculateApyInput {
  dailyRate: BigNumber | number | string;
}

const calculateApy = ({ dailyRate }: CalculateApyInput) => {
  let formattedDailyRate = dailyRate;
  if (typeof formattedDailyRate === 'string') {
    formattedDailyRate = +dailyRate;
  } else if (typeof formattedDailyRate !== 'number') {
    formattedDailyRate = formattedDailyRate.toNumber();
  }

  let apy = formattedDailyRate + 1;
  apy **= DAYS_PER_YEAR;
  apy -= 1;
  apy *= 100;

  return new BigNumber(apy).dp(COMPOUND_DECIMALS);
};

export default calculateApy;
