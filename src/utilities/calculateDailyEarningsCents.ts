import BigNumber from 'bignumber.js';

const calculateDailyEarningsCents = (yearlyEarningsCents: BigNumber) =>
  yearlyEarningsCents.dividedBy(365).toFixed(0);

export default calculateDailyEarningsCents;
