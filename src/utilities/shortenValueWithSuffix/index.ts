import BigNumber from 'bignumber.js';

const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;

const determineDecimalPlaces = (value: BigNumber) => {
  const fixedValue = value.toFixed();
  const dotIndex = fixedValue.indexOf('.');

  if (dotIndex < 0) {
    return 2;
  }

  const decimals = fixedValue.substring(dotIndex + 1);
  const firstNonZeroDecimalIndex = decimals.split('').findIndex(decimal => decimal !== '0');

  const decimalPlaces =
    // If the decimal next to the first non-zero decimal found is also a
    // non-zero, we increment the decimal places by one to include it in the
    // final amount
    decimals[firstNonZeroDecimalIndex + 1] !== '0'
      ? firstNonZeroDecimalIndex + 2
      : firstNonZeroDecimalIndex + 1;

  return decimalPlaces;
};

export interface ShortenValueWithSuffix {
  value: BigNumber;
  minDecimalPlaces?: number;
  maxDecimalPlaces?: number;
}

const shortenValueWithSuffix = ({
  value,
  minDecimalPlaces = 2,
  maxDecimalPlaces,
}: ShortenValueWithSuffix) => {
  if (value.isEqualTo(0)) {
    return '0';
  }

  let formattedValue = value;
  let suffix = '';

  if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    formattedValue = formattedValue.dividedBy(ONE_BILLION);
    suffix = 'B';
  } else if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    formattedValue = formattedValue.dividedBy(ONE_BILLION);
    suffix = 'B';
  } else if (value.isGreaterThanOrEqualTo(ONE_MILLION)) {
    formattedValue = formattedValue.dividedBy(ONE_MILLION);
    suffix = 'M';
  } else if (value.isGreaterThanOrEqualTo(ONE_THOUSAND)) {
    formattedValue = formattedValue.dividedBy(ONE_THOUSAND);
    suffix = 'K';
  }

  let formattedDecimalPlaces = determineDecimalPlaces(formattedValue);

  if (typeof minDecimalPlaces === 'number' && formattedDecimalPlaces < minDecimalPlaces) {
    formattedDecimalPlaces = minDecimalPlaces;
  } else if (typeof maxDecimalPlaces === 'number' && formattedDecimalPlaces > maxDecimalPlaces) {
    formattedDecimalPlaces = maxDecimalPlaces;
  }

  return `${new BigNumber(formattedValue).toFormat(formattedDecimalPlaces)}${suffix}`;
};

export default shortenValueWithSuffix;
