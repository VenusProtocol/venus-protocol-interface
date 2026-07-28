import BigNumber from 'bignumber.js';

export const formatUnitPriceToReadableValue = (unitPrice: number | BigNumber) =>
  new BigNumber(unitPrice).dp(4).toFixed();
