import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

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
            value: valueWei,
            tokenId,
            returnInReadableFormat: true,
          }).toString()
        : '-',
    [valueWei?.toString()],
  );

export default useConvertToReadableCoinString;
