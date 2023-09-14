import BigNumber from 'bignumber.js';
import { Token } from 'types';
import { convertWeiToTokens } from 'utilities';

const getReadableFeeVai = ({
  valueWei,
  mintFeePercentage,
  vai,
}: {
  valueWei: BigNumber;
  mintFeePercentage: number;
  vai: Token;
}) => {
  const feeWei = valueWei.multipliedBy(mintFeePercentage).dividedBy(100);
  return convertWeiToTokens({
    valueWei: feeWei,
    token: vai,
    returnInReadableFormat: true,
  });
};

export default getReadableFeeVai;
