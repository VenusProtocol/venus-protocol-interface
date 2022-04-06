import BigNumber from 'bignumber.js';

import { convertWeiToCoins } from 'utilities/common';
import { VAI_SYMBOL } from '../constants';

const getReadableFeeVai = ({
  valueWei,
  mintFeePercentage,
}: {
  valueWei: BigNumber;
  mintFeePercentage: number;
}) => {
  const feeWei = new BigNumber(valueWei || 0).multipliedBy(mintFeePercentage).dividedBy(100);
  return convertWeiToCoins({
    value: feeWei,
    tokenSymbol: VAI_SYMBOL,
    returnInReadableFormat: true,
  });
};

export default getReadableFeeVai;
