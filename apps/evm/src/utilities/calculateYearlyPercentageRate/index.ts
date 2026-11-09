import BigNumber from 'bignumber.js';

import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import { ONE_MILLION } from 'constants/numbers';
import { DAYS_PER_YEAR } from 'constants/time';

export const MIN_VALUE = -ONE_MILLION;
export const MAX_VALUE = ONE_MILLION;

export interface CalculateYearlyPercentageRateInput {
  dailyPercentageRate: BigNumber | number | string;
  compound?: boolean;
}

export const calculateYearlyPercentageRate = ({
  dailyPercentageRate,
  compound = true,
}: CalculateYearlyPercentageRateInput) => {
  let formattedDailyRate = dailyPercentageRate;
  if (typeof formattedDailyRate === 'string') {
    formattedDailyRate = +dailyPercentageRate;
  } else if (typeof formattedDailyRate !== 'number') {
    formattedDailyRate = formattedDailyRate.toNumber();
  }

  let apy = compound
    ? ((formattedDailyRate + 1) ** DAYS_PER_YEAR - 1) * 100
    : formattedDailyRate * DAYS_PER_YEAR;

  if (apy > MAX_VALUE) {
    apy = MAX_VALUE;
  } else if (apy < MIN_VALUE) {
    apy = MIN_VALUE;
  }

  return new BigNumber(apy).dp(COMPOUND_DECIMALS);
};
