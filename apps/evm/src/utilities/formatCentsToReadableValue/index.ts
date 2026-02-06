import BigNumber from 'bignumber.js';

import { ONE_TRILLION } from 'constants/numbers';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { shortenValueWithSuffix } from 'utilities';

const DEFAULT_MAX_DECIMALS = 2;

const THRESHOLDS = {
  SHORTENED: {
    MAX_VALUE: new BigNumber(100 * ONE_TRILLION),
    MIN_VALUE: new BigNumber(0.01),
  },
  LONG: {
    MAX_VALUE: new BigNumber(100 * ONE_TRILLION),
    MIN_VALUE: new BigNumber(0.000001),
  },
};

export interface FormatCentsToReadableValueInput {
  value: BigNumber.Value | undefined;
  shorten?: boolean;
  maxDecimalPlaces?: number;
}

const formatCentsToReadableValue = ({
  value,
  shorten = true,
  maxDecimalPlaces,
}: FormatCentsToReadableValueInput) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  const wrappedValueDollars = new BigNumber(value).shiftedBy(-2);

  if (wrappedValueDollars.isEqualTo(0)) {
    return '$0';
  }

  const threshold = shorten ? THRESHOLDS.SHORTENED : THRESHOLDS.LONG;
  const safeMaxDecimalPlaces = maxDecimalPlaces ?? DEFAULT_MAX_DECIMALS;
  const absoluteValueDollars = wrappedValueDollars.absoluteValue();
  const isNegative = wrappedValueDollars.isLessThan(0);

  // If the value exceeds the maximum threshold
  if (absoluteValueDollars.isGreaterThan(threshold.MAX_VALUE)) {
    return `${isNegative ? '< -$' : '> $'}${shortenValueWithSuffix({
      value: threshold.MAX_VALUE,
      maxDecimalPlaces: safeMaxDecimalPlaces,
    })}`;
  }

  // If the value is less than the minimum threshold
  if (absoluteValueDollars.isLessThan(threshold.MIN_VALUE)) {
    return `< $${threshold.MIN_VALUE.toFormat()}`;
  }

  const formattedValueDollars = shorten
    ? shortenValueWithSuffix({
        value: absoluteValueDollars,
        maxDecimalPlaces: safeMaxDecimalPlaces,
      })
    : absoluteValueDollars.dp(safeMaxDecimalPlaces).toFormat();

  return `${isNegative ? '-' : ''}$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
