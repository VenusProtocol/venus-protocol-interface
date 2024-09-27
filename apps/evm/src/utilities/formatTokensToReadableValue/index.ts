import BigNumber from 'bignumber.js';

import { ONE_TRILLION } from 'constants/numbers';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import type { Token, VToken } from 'types';

import shortenValueWithSuffix from '../shortenValueWithSuffix';

const MIN_VALUE = 0.000001;
const MAX_VALUE = 100 * ONE_TRILLION;
const MAX_DECIMALS = 6;

export interface FormatTokensToReadableValueInput {
  value: BigNumber | undefined;
  token: Token | VToken | undefined;
  addSymbol?: boolean;
  roundingMode?: BigNumber.RoundingMode;
  maxDecimalPlaces?: number;
}

export const formatTokensToReadableValue = ({
  value,
  token,
  addSymbol = true,
  roundingMode,
  maxDecimalPlaces = MAX_DECIMALS,
}: FormatTokensToReadableValueInput) => {
  if (!token || !value) {
    return PLACEHOLDER_KEY;
  }

  let readableValue: string;
  const absoluteValue = value.absoluteValue();
  const isNegative = value.isLessThan(0);

  if (absoluteValue.isEqualTo(0)) {
    readableValue = '0';
  } else if (absoluteValue.isGreaterThan(MAX_VALUE)) {
    const formattedReadableValue = shortenValueWithSuffix({
      value: new BigNumber(MAX_VALUE),
      roundingMode,
    });
    readableValue = `${isNegative ? '< -' : '> '}${formattedReadableValue}`;
  } else if (absoluteValue.isLessThan(MIN_VALUE)) {
    readableValue = `< ${new BigNumber(MIN_VALUE).toFormat()}`;
  } else {
    const formattedReadableValue = shortenValueWithSuffix({
      value: absoluteValue,
      maxDecimalPlaces,
      roundingMode,
    });

    readableValue = `${isNegative ? '-' : ''}${formattedReadableValue}`;
  }

  if (addSymbol) {
    readableValue += ` ${token.symbol}`;
  }

  return readableValue;
};

export default formatTokensToReadableValue;
