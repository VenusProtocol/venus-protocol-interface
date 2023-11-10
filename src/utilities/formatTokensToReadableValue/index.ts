import BigNumber from 'bignumber.js';
import { Token, VToken } from 'types';

import { ONE_TRILLION } from 'constants/numbers';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

import shortenValueWithSuffix from '../shortenValueWithSuffix';

const MIN_VALUE = 0.000001;
const MAX_VALUE = 100 * ONE_TRILLION;
const MIN_DECIMALS = 2;

export interface FormatTokensToReadableValueInput {
  value: BigNumber | undefined;
  token: Token | VToken | undefined;
  addSymbol?: boolean;
  roundingMode?: BigNumber.RoundingMode;
}

export const formatTokensToReadableValue = ({
  value,
  token,
  addSymbol = true,
  roundingMode,
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
      minDecimalPlaces: MIN_DECIMALS,
      value: new BigNumber(MAX_VALUE),
      roundingMode,
    });
    readableValue = `${isNegative ? '< -' : '> '}${formattedReadableValue}`;
  } else if (absoluteValue.isLessThan(MIN_VALUE)) {
    readableValue = `< ${new BigNumber(MIN_VALUE).toFormat()}`;
  } else {
    const formattedReadableValue = shortenValueWithSuffix({
      value: absoluteValue,
      minDecimalPlaces: MIN_DECIMALS,
      maxDecimalPlaces: token.decimals,
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
