import BigNumber from 'bignumber.js';
import { Token, VToken } from 'types';

import { formatTokensToReadableValue } from './formatTokensToReadableValue';

export interface ConvertWeiToTokensInput<T extends boolean | undefined = false> {
  value: BigNumber;
  token?: Token | VToken;
  returnInReadableFormat?: T;
  addSymbol?: boolean;
}

export type ConvertWeiToTokensOutput<T> = T extends true ? string : BigNumber;

export function convertWeiToTokens<T extends boolean | undefined = false>({
  value,
  token,
  returnInReadableFormat = false,
  addSymbol = true,
}: ConvertWeiToTokensInput<T>): ConvertWeiToTokensOutput<T> {
  const valueTokens = token && value.dividedBy(10 ** token.decimals).decimalPlaces(token.decimals);

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
