import BigNumber from 'bignumber.js';

import { ONE_BILLION, ONE_MILLION, ONE_THOUSAND, ONE_TRILLION } from '../../constants';
import { getSmartDecimalPlaces } from '../getSmartDecimalPlaces';

const LARGE_VALUE_MAX_DECIMAL_PLACES = 2;

export interface ShortenValueWithSuffix {
  value: BigNumber;
  maxDecimalPlaces?: number;
  roundingMode?: BigNumber.RoundingMode;
}

export const shortenValueWithSuffix = ({
  value,
  maxDecimalPlaces,
  roundingMode,
}: ShortenValueWithSuffix) => {
  let formattedValue = value;
  let suffix = '';

  if (value.isGreaterThanOrEqualTo(ONE_TRILLION)) {
    formattedValue = formattedValue.dividedBy(ONE_TRILLION);
    suffix = 'T';
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

  const isLargeValue = value.isGreaterThanOrEqualTo(ONE_THOUSAND);

  const decimalPlaces = getSmartDecimalPlaces({
    value: formattedValue,
    maxDecimalPlaces: isLargeValue ? LARGE_VALUE_MAX_DECIMAL_PLACES : maxDecimalPlaces,
  });

  return `${new BigNumber(formattedValue).toFormat(decimalPlaces, roundingMode)}${suffix}`;
};
