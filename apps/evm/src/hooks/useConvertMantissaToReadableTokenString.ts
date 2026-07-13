import { useMemo } from 'react';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import type { Token, VToken, VhToken } from 'types';
import { type ConvertMantissaToTokensInput, convertMantissaToTokens } from 'utilities';

export interface UseConvertMantissaToReadableTokenStringInput<
  TToken extends Token | VToken | VhToken | undefined,
> extends Omit<ConvertMantissaToTokensInput<TToken>, 'value' | 'returnInReadableFormat'> {
  value: ConvertMantissaToTokensInput<TToken>['value'] | undefined;
}

const useConvertMantissaToReadableTokenString = <
  TToken extends Token | VToken | VhToken | undefined,
>(
  params: UseConvertMantissaToReadableTokenStringInput<TToken>,
) =>
  useMemo(
    () =>
      params.value
        ? convertMantissaToTokens({
            ...(params as ConvertMantissaToTokensInput<TToken>),
            returnInReadableFormat: true,
          })
        : PLACEHOLDER_KEY,
    [params],
  );

export default useConvertMantissaToReadableTokenString;
