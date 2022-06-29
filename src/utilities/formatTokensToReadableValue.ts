import BigNumber from 'bignumber.js';
import { TokenId } from 'types';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { shortenTokensWithSuffix } from './shortenTokensWithSuffix';
import { getToken } from './getToken';

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
    // If value is greater than 1, use 2 decimal places, otherwise use 8
    // see (https://app.clickup.com/24381231/v/dc/q81tf-9288/q81tf-1128)
    decimalPlaces = value.gt(1) ? 2 : 8;
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
