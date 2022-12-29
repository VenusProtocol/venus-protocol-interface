import BigNumber from 'bignumber.js';

const convertDollarsToCents = (value: number | BigNumber) =>
  new BigNumber(value).times(100).dp(0).toNumber();

export default convertDollarsToCents;
