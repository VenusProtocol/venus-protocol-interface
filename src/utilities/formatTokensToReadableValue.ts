import BigNumber from 'bignumber.js';
import { Token, VToken } from 'types';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import { shortenValueWithSuffix } from './shortenValueWithSuffix';

export interface FormatTokensToReadableValueInput {
  value: BigNumber | undefined;
  token: Token | VToken;
  minimizeDecimals?: boolean;
  shortenLargeValue?: boolean;
  addSymbol?: boolean;
}

export const formatTokensToReadableValue = ({
  value,
  token,
  minimizeDecimals = false,
  shortenLargeValue = false,
  addSymbol = true,
}: FormatTokensToReadableValueInput) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  let decimalPlaces;
  if (minimizeDecimals) {
    decimalPlaces = 8;
  } else {
    decimalPlaces = token.decimals;
  }

  let symbolPlacement = '';
  if (addSymbol) {
    symbolPlacement = ` ${token.symbol}`;
  }

  if (shortenLargeValue) {
    return `${shortenValueWithSuffix({
      value,
    })}${symbolPlacement}`;
  }

  return `${value.dp(decimalPlaces).toFormat()}${symbolPlacement}`;
};

export default formatTokensToReadableValue;
