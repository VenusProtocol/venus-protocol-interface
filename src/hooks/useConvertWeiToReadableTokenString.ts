import { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

import { convertWeiToTokens, IConvertWeiToTokensInput } from 'utilities';

export interface IUseConvertWeiToReadableTokenStringInput
  extends Omit<IConvertWeiToTokensInput, 'valueWei' | 'returnInReadableFormat'> {
  valueWei: IConvertWeiToTokensInput['valueWei'] | undefined;
}

const useConvertWeiToReadableTokenString = (params: IUseConvertWeiToReadableTokenStringInput) =>
  useMemo(
    () =>
      params.valueWei
        ? convertWeiToTokens({
            ...(params as IConvertWeiToTokensInput),
            returnInReadableFormat: true,
          })
        : PLACEHOLDER_KEY,
    [
      params.valueWei?.toFixed(),
      params.tokenId,
      params.minimizeDecimals,
      params.addSymbol,
      params.shortenLargeValue,
    ],
  );

export default useConvertWeiToReadableTokenString;
