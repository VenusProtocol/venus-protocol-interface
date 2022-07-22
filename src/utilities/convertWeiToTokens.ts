import BigNumber from 'bignumber.js';
import { TokenId } from 'types';

import { formatTokensToReadableValue } from './formatTokensToReadableValue';
import { getToken } from './getToken';

export interface ConvertWeiToTokensInput<T extends boolean | undefined = false> {
  valueWei: BigNumber;
  tokenId: TokenId;
  returnInReadableFormat?: T;
  minimizeDecimals?: boolean;
  addSymbol?: boolean;
  shortenLargeValue?: boolean;
}

export type ConvertWeiToTokensOutput<T> = T extends true ? string : BigNumber;

export function convertWeiToTokens<T extends boolean | undefined = false>({
  valueWei,
  tokenId,
  returnInReadableFormat = false,
  minimizeDecimals = false,
  addSymbol = true,
  shortenLargeValue = false,
}: ConvertWeiToTokensInput<T>): ConvertWeiToTokensOutput<T> {
  const tokenDecimals = getToken(tokenId).decimals;
  const valueTokens = valueWei
    .dividedBy(new BigNumber(10).pow(tokenDecimals))
    .decimalPlaces(tokenDecimals);

  return (
    returnInReadableFormat
      ? formatTokensToReadableValue({
          value: valueTokens,
          tokenId,
          minimizeDecimals,
          addSymbol,
          shortenLargeValue,
        })
      : valueTokens
  ) as ConvertWeiToTokensOutput<T>;
}

export default convertWeiToTokens;
