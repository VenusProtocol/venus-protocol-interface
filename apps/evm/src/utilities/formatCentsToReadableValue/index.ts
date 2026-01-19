import BigNumber from 'bignumber.js';

import { ONE_TRILLION } from 'constants/numbers';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { shortenValueWithSuffix } from 'utilities';

const THRESHOLDS = {
  DOLLARS: {
    MAX_VALUE: new BigNumber(100 * ONE_TRILLION),
    MIN_VALUE: new BigNumber(0.01),
    MAX_DECIMALS: 2,
  },
  TOKEN_PRICE: {
    MAX_VALUE: new BigNumber(100 * ONE_TRILLION),
    MIN_VALUE: new BigNumber(0.000001),
    MAX_DECIMALS: 6,
  },
};

export interface FormatCentsToReadableValueInput {
  value: BigNumber.Value | undefined;
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

  const threshold = isTokenPrice ? THRESHOLDS.TOKEN_PRICE : THRESHOLDS.DOLLARS;
  const absoluteValueDollars = wrappedValueDollars.absoluteValue();
  const isNegative = wrappedValueDollars.isLessThan(0);

  // If the value exceeds the maximum threshold
  if (absoluteValueDollars.isGreaterThan(threshold.MAX_VALUE)) {
    return `${isNegative ? '< -$' : '> $'}${shortenValueWithSuffix({
      value: threshold.MAX_VALUE,
      maxDecimalPlaces: threshold.MAX_DECIMALS,
    })}`;
  }

  // If the value is less than the minimum threshold
  if (absoluteValueDollars.isLessThan(threshold.MIN_VALUE)) {
    return `< $${threshold.MIN_VALUE.toFormat()}`;
  }

  const formattedValueDollars = isTokenPrice
    ? absoluteValueDollars.dp(threshold.MAX_DECIMALS).toFormat()
    : shortenValueWithSuffix({
        value: absoluteValueDollars,
        maxDecimalPlaces: threshold.MAX_DECIMALS,
      });

  return `${isNegative ? '-' : ''}$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
