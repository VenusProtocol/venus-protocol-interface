import BigNumber from 'bignumber.js';
import { Token, VToken } from 'types';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import shortenValueWithSuffix from '../shortenValueWithSuffix';

export const SMALLEST_READABLE_VALUE = 0.000001;
export const HIGHEST_READABLE_VALUE = 100000000000;

export interface FormatTokensToReadableValueInput {
  value: BigNumber | undefined;
  token: Token | VToken;
  addSymbol?: boolean;
}

export const formatTokensToReadableValue = ({
  value,
  token,
  addSymbol = true,
}: FormatTokensToReadableValueInput) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  let readableValue;

  if (value.isEqualTo(0)) {
    readableValue = '0';
  } else if (value.isGreaterThan(HIGHEST_READABLE_VALUE)) {
    readableValue = `> ${shortenValueWithSuffix({
      value: new BigNumber(HIGHEST_READABLE_VALUE),
    })}`;
  } else {
    const isInsignificant =
      new BigNumber(value).isLessThan(SMALLEST_READABLE_VALUE) &&
      new BigNumber(value).isGreaterThan(-SMALLEST_READABLE_VALUE);

    readableValue = isInsignificant
      ? `< ${new BigNumber(SMALLEST_READABLE_VALUE).toFormat()}`
      : shortenValueWithSuffix({
          value,
          maxDecimalPlaces: token.decimals,
        });
  }

  if (addSymbol) {
    readableValue += ` ${token.symbol}`;
  }

  return readableValue;
};

export default formatTokensToReadableValue;
