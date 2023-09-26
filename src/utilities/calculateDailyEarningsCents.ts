import BigNumber from 'bignumber.js';

export const calculateDailyEarningsCents = (yearlyEarningsCents: BigNumber) =>
  yearlyEarningsCents.dividedBy(365);
