import { useMemo } from 'react';
import { ConvertWeiToTokensInput, convertWeiToTokens } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

export interface UseConvertWeiToReadableTokenStringInput
  extends Omit<ConvertWeiToTokensInput, 'valueWei' | 'returnInReadableFormat'> {
  valueWei: ConvertWeiToTokensInput['valueWei'] | undefined;
}

const useConvertWeiToReadableTokenString = (params: UseConvertWeiToReadableTokenStringInput) =>
  useMemo(
    () =>
      params.valueWei
        ? convertWeiToTokens({
            ...(params as ConvertWeiToTokensInput),
            returnInReadableFormat: true,
          })
        : PLACEHOLDER_KEY,
    [params.valueWei?.toFixed(), params.token, params.addSymbol],
  );

export default useConvertWeiToReadableTokenString;
