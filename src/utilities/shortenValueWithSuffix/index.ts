import BigNumber from 'bignumber.js';

import determineDecimalPlaces from '../determineDecimalPlaces';

const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;
export const SMALLEST_READABLE_VALUE = 0.0000001;

export interface ShortenValueWithSuffix {
  value: BigNumber;
  decimalPlaces?: number;
}

const shortenValueWithSuffix = ({ value, decimalPlaces }: ShortenValueWithSuffix) => {
  if (value.isEqualTo(0)) {
    return '0';
  }

  if (value.isLessThan(SMALLEST_READABLE_VALUE) && Number(value) > 0) {
    return `< ${new BigNumber(SMALLEST_READABLE_VALUE).toFixed()}`;
  }

  let formattedValue = value;
  let suffix = '';

  if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    formattedValue = formattedValue.dividedBy(ONE_BILLION);
    suffix = 'B';
  } else if (value.isGreaterThanOrEqualTo(ONE_MILLION)) {
    formattedValue = formattedValue.dividedBy(ONE_MILLION);
    suffix = 'M';
  } else if (value.isGreaterThanOrEqualTo(ONE_THOUSAND)) {
    formattedValue = formattedValue.dividedBy(ONE_THOUSAND);
    suffix = 'K';
  }

  const formattedDecimalPlaces =
    decimalPlaces !== undefined ? decimalPlaces : determineDecimalPlaces(formattedValue);

  return `${new BigNumber(formattedValue).toFormat(formattedDecimalPlaces)}${suffix}`;
};

export default shortenValueWithSuffix;
