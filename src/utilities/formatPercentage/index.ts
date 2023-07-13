import BigNumber from 'bignumber.js';

const LARGEST_VALUE = 100000000;

const formatPercentage = (value: string | number | BigNumber) => {
  const valueBn = new BigNumber(value);

  if (!valueBn.isFinite() || valueBn.absoluteValue().isGreaterThanOrEqualTo(LARGEST_VALUE)) {
    return LARGEST_VALUE;
  }

  return +valueBn.dp(2).toFixed();
};

export default formatPercentage;
