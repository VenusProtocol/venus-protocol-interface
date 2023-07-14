import BigNumber from 'bignumber.js';

import getSmartDecimalPlaces from 'utilities/getSmartDecimalPlaces';

const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;

export interface ShortenValueWithSuffix {
  value: BigNumber;
  minDecimalPlaces?: number;
  maxDecimalPlaces?: number;
}

const shortenValueWithSuffix = ({
  value,
  minDecimalPlaces,
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

  const decimalPlaces = getSmartDecimalPlaces({
    value: formattedValue,
    minDecimalPlaces,
    maxDecimalPlaces,
  });

  return `${new BigNumber(formattedValue).toFormat(decimalPlaces)}${suffix}`;
};

export default shortenValueWithSuffix;
