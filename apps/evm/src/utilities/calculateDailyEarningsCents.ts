import BigNumber from 'bignumber.js';

const calculateDailyEarningsCents = (yearlyEarningsCents: BigNumber) =>
  yearlyEarningsCents.dividedBy(365);

export default calculateDailyEarningsCents;
