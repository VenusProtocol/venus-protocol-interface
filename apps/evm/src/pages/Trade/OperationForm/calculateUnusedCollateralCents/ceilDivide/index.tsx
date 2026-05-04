import BigNumber from 'bignumber.js';

export const ceilDivide = (value: BigNumber, divisor: BigNumber) =>
  value.div(divisor).integerValue(BigNumber.ROUND_CEIL);
