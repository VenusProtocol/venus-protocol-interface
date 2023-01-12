import BigNumber from 'bignumber.js';
import { convertWeiToTokens } from 'utilities';

import { TOKENS } from 'constants/tokens';

const getReadableFeeVai = ({
  valueWei,
  feePercentage,
}: {
  valueWei: BigNumber;
  feePercentage: number;
}) => {
  const feeWei = valueWei.multipliedBy(feePercentage).dividedBy(100);
  return convertWeiToTokens({
    valueWei: feeWei,
    token: TOKENS.vai,
    returnInReadableFormat: true,
  });
};

export default getReadableFeeVai;
