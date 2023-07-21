import BigNumber from 'bignumber.js';
import { shortenValueWithSuffix } from 'utilities';

import { ONE_TRILLION } from 'constants/numbers';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

const THRESHOLDS = {
  DOLLARS: {
    MAX_VALUE: new BigNumber(100 * ONE_TRILLION),
    MIN_VALUE: new BigNumber(0.01),
    MIN_DECIMALS: 2,
    MAX_DECIMALS: 2,
  },
  TOKEN_PRICE: {
    MAX_VALUE: new BigNumber(100 * ONE_TRILLION),
    MIN_VALUE: new BigNumber(0.00000001),
    MIN_DECIMALS: 2,
    MAX_DECIMALS: 6,
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

  const threshold = isTokenPrice ? THRESHOLDS.TOKEN_PRICE : THRESHOLDS.DOLLARS;
  const absoluteValueDollars = wrappedValueDollars.absoluteValue();
  const isNegative = wrappedValueDollars.isLessThan(0);

  // If the value exceeds the maximum threshold
  if (absoluteValueDollars.isGreaterThan(threshold.MAX_VALUE)) {
    return `${isNegative ? '< -$' : '> $'}${shortenValueWithSuffix({
      value: threshold.MAX_VALUE,
      minDecimalPlaces: threshold.MIN_DECIMALS,
      maxDecimalPlaces: threshold.MAX_DECIMALS,
    })}`;
  }

  // If the value is less than the MIN_VALUEimum threshold
  if (absoluteValueDollars.isLessThan(threshold.MIN_VALUE)) {
    return `< $${threshold.MIN_VALUE.toFormat()}`;
  }

  const formattedValueDollars = isTokenPrice
    ? absoluteValueDollars.dp(threshold.MAX_DECIMALS).toFormat()
    : shortenValueWithSuffix({
        value: absoluteValueDollars,
        minDecimalPlaces: threshold.MIN_DECIMALS,
        maxDecimalPlaces: threshold.MAX_DECIMALS,
      });

  return `${isNegative ? '-' : ''}$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
