import BigNumber from 'bignumber.js';
import { TokenId } from 'types';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import { getToken } from './getToken';
import { shortenTokensWithSuffix } from './shortenTokensWithSuffix';

export const formatTokensToReadableValue = ({
  value,
  tokenId,
  minimizeDecimals = false,
  shortenLargeValue = false,
  addSymbol = true,
}: {
  value: BigNumber | undefined;
  tokenId: TokenId;
  minimizeDecimals?: boolean;
  shortenLargeValue?: boolean;
  addSymbol?: boolean;
}) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  let decimalPlaces;
  if (minimizeDecimals) {
    decimalPlaces = 8;
  } else {
    const token = getToken(tokenId);
    decimalPlaces = token.decimals;
  }

  let symbolPlacement = '';
  if (addSymbol) {
    const token = getToken(tokenId);
    symbolPlacement = ` ${token.symbol}`;
  }

  if (shortenLargeValue) {
    return `${shortenTokensWithSuffix(value)}${symbolPlacement}`;
  }

  return `${value.dp(decimalPlaces).toFormat()}${symbolPlacement}`;
};

export default formatTokensToReadableValue;
