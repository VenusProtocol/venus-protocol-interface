import type BigNumber from 'bignumber.js';

import type { Token, VToken } from 'types';

import { formatTokensToReadableValue } from './formatTokensToReadableValue';

export interface ConvertMantissaToTokensInput<T extends boolean | undefined = false> {
  value: BigNumber;
  token?: Token | VToken;
  returnInReadableFormat?: T;
  addSymbol?: boolean;
}

export type ConvertMantissaToTokensOutput<T> = T extends true ? string : BigNumber;

export function convertMantissaToTokens<T extends boolean | undefined = false>({
  value,
  token,
  returnInReadableFormat = false,
  addSymbol = true,
}: ConvertMantissaToTokensInput<T>): ConvertMantissaToTokensOutput<T> {
  const valueTokens = token && value.dividedBy(10 ** token.decimals).decimalPlaces(token.decimals);

  return (
    returnInReadableFormat
      ? formatTokensToReadableValue({
          value: valueTokens,
          token,
          addSymbol,
        })
      : valueTokens
  ) as ConvertMantissaToTokensOutput<T>;
}

export default convertMantissaToTokens;
