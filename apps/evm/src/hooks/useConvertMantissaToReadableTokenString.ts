import { useMemo } from 'react';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { ConvertMantissaToTokensInput, convertMantissaToTokens } from 'utilities';

export interface UseConvertMantissaToReadableTokenStringInput
  extends Omit<ConvertMantissaToTokensInput, 'value' | 'returnInReadableFormat'> {
  value: ConvertMantissaToTokensInput['value'] | undefined;
}

const useConvertMantissaToReadableTokenString = (
  params: UseConvertMantissaToReadableTokenStringInput,
) =>
  useMemo(
    () =>
      params.value
        ? convertMantissaToTokens({
            ...(params as ConvertMantissaToTokensInput),
            returnInReadableFormat: true,
          })
        : PLACEHOLDER_KEY,
    [params],
  );

export default useConvertMantissaToReadableTokenString;
