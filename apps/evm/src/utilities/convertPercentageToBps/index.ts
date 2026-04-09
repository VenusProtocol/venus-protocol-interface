import BigNumber from 'bignumber.js';

export const convertPercentageToBps = ({ percentage }: { percentage: number }) =>
  BigInt(new BigNumber(percentage).multipliedBy(100).toFixed(0));
