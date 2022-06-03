import { useMemo } from 'react';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

import { convertWeiToCoins, IConvertWeiToCoinsInput } from 'utilities/common';

export interface IUseConvertToReadableCoinStringInput
  extends Omit<IConvertWeiToCoinsInput, 'valueWei' | 'returnInReadableFormat'> {
  valueWei: IConvertWeiToCoinsInput['valueWei'] | undefined;
}

const useConvertToReadableCoinString = (params: IUseConvertToReadableCoinStringInput) =>
  useMemo(
    () =>
      params.valueWei
        ? convertWeiToCoins({
            ...(params as IConvertWeiToCoinsInput),
            returnInReadableFormat: true,
          })
        : PLACEHOLDER_KEY,
    [params.valueWei?.toFixed(), params.tokenId, params.minimizeDecimals],
  );

export default useConvertToReadableCoinString;
