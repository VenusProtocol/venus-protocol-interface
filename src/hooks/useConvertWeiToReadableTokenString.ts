import { useMemo } from 'react';
import { ConvertWeiToTokensInput, convertWeiToTokens } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

export interface UseConvertWeiToReadableTokenStringInput
  extends Omit<ConvertWeiToTokensInput, 'value' | 'returnInReadableFormat'> {
  value: ConvertWeiToTokensInput['value'] | undefined;
}

const useConvertWeiToReadableTokenString = (params: UseConvertWeiToReadableTokenStringInput) =>
  useMemo(
    () =>
      params.value
        ? convertWeiToTokens({
            ...(params as ConvertWeiToTokensInput),
            returnInReadableFormat: true,
          })
        : PLACEHOLDER_KEY,
    [params],
  );

export default useConvertWeiToReadableTokenString;
