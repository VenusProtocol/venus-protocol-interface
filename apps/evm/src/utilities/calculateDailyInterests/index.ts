import type BigNumber from 'bignumber.js';

export const calculateDailyInterests = (yearlyInterests: BigNumber) =>
  yearlyInterests.dividedBy(365);
