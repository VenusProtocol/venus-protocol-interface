import BigNumber from 'bignumber.js';
import { Token } from 'types';

import { formatTokensToReadableValue } from './formatTokensToReadableValue';

export interface ConvertWeiToTokensInput<T extends boolean | undefined = false> {
  valueWei: BigNumber;
  token: Token;
  returnInReadableFormat?: T;
  minimizeDecimals?: boolean;
  addSymbol?: boolean;
  shortenLargeValue?: boolean;
}

export type ConvertWeiToTokensOutput<T> = T extends true ? string : BigNumber;

export function convertWeiToTokens<T extends boolean | undefined = false>({
  valueWei,
  token,
  returnInReadableFormat = false,
  minimizeDecimals = false,
  addSymbol = true,
  shortenLargeValue = false,
}: ConvertWeiToTokensInput<T>): ConvertWeiToTokensOutput<T> {
  const valueTokens = valueWei
    .dividedBy(new BigNumber(10).pow(token.decimals))
    .decimalPlaces(token.decimals);

  return (
    returnInReadableFormat
      ? formatTokensToReadableValue({
          value: valueTokens,
          token,
          minimizeDecimals,
          addSymbol,
          shortenLargeValue,
        })
      : valueTokens
  ) as ConvertWeiToTokensOutput<T>;
}

export default convertWeiToTokens;
