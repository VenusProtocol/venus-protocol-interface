import BigNumber from 'bignumber.js';

export const shortenTokensWithSuffix = (value: BigNumber) => {
  const ONE_BILLION = 1000000000;
  const ONE_MILLION = 1000000;
  const ONE_THOUSAND = 1000;

  let shortenedValue = value.toFixed(2);
  if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    shortenedValue = `${value.dividedBy(ONE_BILLION).dp(2).toFormat()}B`;
  } else if (value.isGreaterThanOrEqualTo(ONE_MILLION)) {
    shortenedValue = `${value.dividedBy(ONE_MILLION).dp(2).toFormat()}M`;
  } else if (value.isGreaterThanOrEqualTo(ONE_THOUSAND)) {
    shortenedValue = `${value.dividedBy(ONE_THOUSAND).dp(2).toFormat()}K`;
  }
  return shortenedValue;
};

export default shortenTokensWithSuffix;
