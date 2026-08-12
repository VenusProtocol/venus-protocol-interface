import BigNumber from 'bignumber.js';

export const convertRatioToPercentage = (value: BigNumber.Value) =>
  new BigNumber(value).multipliedBy(100);
