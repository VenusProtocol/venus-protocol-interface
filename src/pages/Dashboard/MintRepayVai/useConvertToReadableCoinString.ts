import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { TokenId } from 'types';
import { convertWeiToCoins } from 'utilities/common';

const useConvertToReadableCoinString = ({
  tokenSymbol,
  valueWei,
}: {
  tokenSymbol: TokenId;
  valueWei?: BigNumber;
}) =>
  useMemo(
    () =>
      valueWei
        ? convertWeiToCoins({
            value: valueWei,
            tokenSymbol,
            returnInReadableFormat: true,
          }).toString()
        : '-',
    [valueWei?.toString()],
  );

export default useConvertToReadableCoinString;
