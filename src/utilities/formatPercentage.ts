import BigNumber from 'bignumber.js';

const formatPercentage = (value: string | number | BigNumber) => {
  const valueBn = new BigNumber(value);

  if (valueBn.absoluteValue().isGreaterThanOrEqualTo(100000000)) {
    return +valueBn.toExponential(2);
  }

  return +valueBn.dp(2).toFixed();
};

export default formatPercentage;
