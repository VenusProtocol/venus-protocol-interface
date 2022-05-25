import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import PLACEHOLDER_KEY from 'constants/placeholderKey';

import { TokenId } from 'types';
import { convertWeiToCoins } from 'utilities/common';

const useConvertToReadableCoinString = ({
  tokenId,
  valueWei,
}: {
  tokenId: TokenId;
  valueWei?: BigNumber;
}) =>
  useMemo(
    () =>
      valueWei
        ? convertWeiToCoins({
            valueWei,
            tokenId,
            returnInReadableFormat: true,
          })
        : PLACEHOLDER_KEY,
    [valueWei?.toString()],
  );

export default useConvertToReadableCoinString;
