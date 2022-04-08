import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { TokenSymbol } from 'types';
import { convertWeiToCoins } from 'utilities/common';

const useConvertToReadableCoinString = ({
  tokenSymbol,
  valueWei,
}: {
  tokenSymbol: TokenSymbol;
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
