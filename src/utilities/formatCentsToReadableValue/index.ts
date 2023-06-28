import BigNumber from 'bignumber.js';
import { shortenValueWithSuffix } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

export const MAX_DECIMALS = 2;
export const SMALLEST_READABLE_VALUE = 0.01;
export const HIGHEST_READABLE_VALUE = 100000000000;

export const TOKEN_PRICE_MAX_DECIMALS = 6;
export const SMALLEST_READABLE_TOKEN_PRICE_VALUE = 0.00000001;

export interface FormatCentsToReadableValueInput {
  value: number | BigNumber | undefined;
  isTokenPrice?: boolean;
}

const formatCentsToReadableValue = ({
  value,
  isTokenPrice = false,
}: FormatCentsToReadableValueInput) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  // Convert cents to dollars
  const wrappedValueDollars = new BigNumber(value).shiftedBy(-2);

  if (wrappedValueDollars.isEqualTo(0)) {
    return '$0';
  }

  if (wrappedValueDollars.isGreaterThan(HIGHEST_READABLE_VALUE)) {
    return `> $${shortenValueWithSuffix({
      value: new BigNumber(HIGHEST_READABLE_VALUE),
    })}`;
  }

  // Handle token prices
  if (isTokenPrice) {
    const isInsignificant =
      wrappedValueDollars.isLessThan(SMALLEST_READABLE_TOKEN_PRICE_VALUE) &&
      wrappedValueDollars.isGreaterThan(-SMALLEST_READABLE_TOKEN_PRICE_VALUE);

    return isInsignificant
      ? `< $${new BigNumber(SMALLEST_READABLE_TOKEN_PRICE_VALUE).toFormat()}`
      : `$${wrappedValueDollars.dp(TOKEN_PRICE_MAX_DECIMALS).toFormat()}`;
  }

  // Handle dollar values that aren't token prices
  if (
    wrappedValueDollars.isLessThan(SMALLEST_READABLE_VALUE) &&
    wrappedValueDollars.isGreaterThan(-SMALLEST_READABLE_VALUE)
  ) {
    return `< $${new BigNumber(SMALLEST_READABLE_VALUE).toFormat()}`;
  }

  const formattedValueDollars = shortenValueWithSuffix({
    value: wrappedValueDollars,
    maxDecimalPlaces: MAX_DECIMALS,
  });

  return formattedValueDollars[0] === '-'
    ? // Format negative values to place minus sign before dollar sign
      `-$${formattedValueDollars.substring(1)}`
    : `$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
