import BigNumber from 'bignumber.js';

import { ONE_THOUSAND } from 'constants/numbers';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import getSmartDecimalPlaces from 'utilities/getSmartDecimalPlaces';

export const MIN_VALUE = 0.01;
export const MAX_VALUE = 10 * ONE_THOUSAND;
export const MAX_DECIMALS = 2;

const formatPercentageToReadableValue = (value: number | string | BigNumber | undefined) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  const wrappedValue = new BigNumber(value);
  const absoluteValue = wrappedValue.absoluteValue();
  const isNegative = wrappedValue.isNegative();
  let readableValue: string;

  if (absoluteValue.isEqualTo(0)) {
    readableValue = '0';
  } else if (absoluteValue.isGreaterThan(MAX_VALUE)) {
    readableValue = `${isNegative ? '< -' : '> '}${new BigNumber(MAX_VALUE).toFormat()}`;
  } else if (absoluteValue.isLessThan(MIN_VALUE)) {
    readableValue = `< ${new BigNumber(MIN_VALUE).toFormat()}`;
  } else {
    const decimalPlaces = getSmartDecimalPlaces({
      value: absoluteValue,
      maxDecimalPlaces: MAX_DECIMALS,
    });

    readableValue = `${isNegative ? '-' : ''}${absoluteValue.toFormat(decimalPlaces)}`;
  }

  return `${readableValue}%`;
};

export default formatPercentageToReadableValue;
