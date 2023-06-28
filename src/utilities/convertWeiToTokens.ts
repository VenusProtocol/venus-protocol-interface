import BigNumber from 'bignumber.js';
import { Token, VToken } from 'types';

import { formatTokensToReadableValue } from './formatTokensToReadableValue';

export interface ConvertWeiToTokensInput<T extends boolean | undefined = false> {
  valueWei: BigNumber;
  token: Token | VToken;
  returnInReadableFormat?: T;
  addSymbol?: boolean;
}

export type ConvertWeiToTokensOutput<T> = T extends true ? string : BigNumber;

export function convertWeiToTokens<T extends boolean | undefined = false>({
  valueWei,
  token,
  returnInReadableFormat = false,
  addSymbol = true,
}: ConvertWeiToTokensInput<T>): ConvertWeiToTokensOutput<T> {
  const valueTokens = valueWei
    .dividedBy(new BigNumber(10).pow(token.decimals))
    .decimalPlaces(token.decimals);

  return (
    returnInReadableFormat
      ? formatTokensToReadableValue({
          value: valueTokens,
          token,
          addSymbol,
        })
      : valueTokens
  ) as ConvertWeiToTokensOutput<T>;
}

export default convertWeiToTokens;
