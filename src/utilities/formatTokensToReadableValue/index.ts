import BigNumber from 'bignumber.js';
import { Token, VToken } from 'types';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import shortenValueWithSuffix from '../shortenValueWithSuffix';

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

  let readableValue = shortenValueWithSuffix({
    value,
  });

  if (addSymbol) {
    readableValue += ` ${token.symbol}`;
  }

  return readableValue;
};

export default formatTokensToReadableValue;
