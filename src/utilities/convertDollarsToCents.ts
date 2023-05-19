import BigNumber from 'bignumber.js';

const convertDollarsToCents = (
  value: number | BigNumber,
  { whole }: { whole: boolean } = { whole: true },
) => {
  const cents = new BigNumber(value).times(100);
  if (whole) {
    return cents.dp(0).toNumber();
  }
  return cents.toNumber();
};

export default convertDollarsToCents;
