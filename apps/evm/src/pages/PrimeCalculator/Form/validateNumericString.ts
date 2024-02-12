import BigNumber from 'bignumber.js';

export const validateNumericString = (str: string, minValue = new BigNumber(0)) => {
  if (!str) {
    return true;
  }
  const n = new BigNumber(str);
  const isNumber = BigNumber.isBigNumber(n);
  const gteMinValue = n.gte(minValue);

  return isNumber && gteMinValue;
};
