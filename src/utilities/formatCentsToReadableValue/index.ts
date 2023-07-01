import BigNumber from 'bignumber.js';
import { shortenValueWithSuffix } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

const THRESHOLDS = {
  DEFAULT: { MAX: new BigNumber(100000000000), MIN: new BigNumber(0.01), DECIMALS: 2 },
  TOKEN_PRICE: {
    MAX: new BigNumber(100000000000),
    MIN: new BigNumber(0.00000001),
    DECIMALS: 6,
  },
};

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

  const wrappedValueDollars = new BigNumber(value).shiftedBy(-2);

  if (wrappedValueDollars.isEqualTo(0)) {
    return '$0';
  }

  const threshold = isTokenPrice ? THRESHOLDS.TOKEN_PRICE : THRESHOLDS.DEFAULT;
  const absoluteValueDollars = wrappedValueDollars.absoluteValue();
  const isNegative = wrappedValueDollars.isLessThan(0);

  // If the value exceeds the maximum threshold
  if (absoluteValueDollars.isGreaterThan(threshold.MAX)) {
    return `${isNegative ? '< -$' : '> $'}${shortenValueWithSuffix({ value: threshold.MAX })}`;
  }

  // If the value is less than the minimum threshold
  if (absoluteValueDollars.isLessThan(threshold.MIN)) {
    return `< $${threshold.MIN.toFormat()}`;
  }

  const formattedValueDollars = isTokenPrice
    ? absoluteValueDollars.dp(threshold.DECIMALS).toFormat()
    : shortenValueWithSuffix({
        value: absoluteValueDollars,
        maxDecimalPlaces: threshold.DECIMALS,
      });

  return `${isNegative ? '-' : ''}$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
