import BigNumber from 'bignumber.js';

import { ONE_BILLION, ONE_MILLION, ONE_THOUSAND, ONE_TRILLION } from 'constants/numbers';
import getSmartDecimalPlaces from 'utilities/getSmartDecimalPlaces';

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

  if (value.isGreaterThanOrEqualTo(ONE_TRILLION)) {
    formattedValue = formattedValue.dividedBy(ONE_TRILLION);
    suffix = 'T';
  } else if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
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
