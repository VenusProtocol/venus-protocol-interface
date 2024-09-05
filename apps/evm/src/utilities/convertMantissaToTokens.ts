import type BigNumber from 'bignumber.js';
import type { Token, VToken } from 'types';
import { formatTokensToReadableValue } from './formatTokensToReadableValue';

export interface ConvertMantissaToTokensInput<TToken extends Token | VToken | undefined> {
  value: BigNumber;
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

  const valueTokens = value.dividedBy(10 ** token.decimals).decimalPlaces(token.decimals);

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
