import BigNumber from 'bignumber.js';
import type { Token, VToken } from 'types';
import { formatTokensToReadableValue } from './formatTokensToReadableValue';

export interface ConvertMantissaToTokensInput<TToken extends Token | VToken | undefined> {
  value: BigNumber | bigint;
  token: TToken | undefined;
  returnInReadableFormat?: boolean;
  addSymbol?: boolean;
}

export function convertMantissaToTokens(input: ConvertMantissaToTokensInput<undefined>): undefined;
export function convertMantissaToTokens(
  input: ConvertMantissaToTokensInput<Token | VToken> & { returnInReadableFormat: true },
): string;
export function convertMantissaToTokens(
  input: ConvertMantissaToTokensInput<Token | VToken> & { returnInReadableFormat?: false },
): BigNumber;

export function convertMantissaToTokens({
  value,
  token,
  returnInReadableFormat = false,
  addSymbol = true,
}: ConvertMantissaToTokensInput<Token | VToken | undefined>): undefined | string | BigNumber {
  if (token === undefined) {
    return undefined;
  }

  const valueTokens = new BigNumber(typeof value === 'bigint' ? value.toString() : value.toFixed())
    .dividedBy(10 ** token.decimals)
    .decimalPlaces(token.decimals);

  if (returnInReadableFormat) {
    return formatTokensToReadableValue({
      value: valueTokens,
      token,
      addSymbol,
    });
  }

  return valueTokens;
}

export default convertMantissaToTokens;
