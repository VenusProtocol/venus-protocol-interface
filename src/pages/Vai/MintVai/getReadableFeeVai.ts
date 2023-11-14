import BigNumber from 'bignumber.js';
import { Token } from 'types';
import { convertWeiToTokens } from 'utilities';

const getReadableFeeVai = ({
  value,
  mintFeePercentage,
  vai,
}: {
  value: BigNumber;
  mintFeePercentage: number;
  vai: Token;
}) => {
  const feeWei = value.multipliedBy(mintFeePercentage).dividedBy(100);
  return convertWeiToTokens({
    value: feeWei,
    token: vai,
    returnInReadableFormat: true,
  });
};

export default getReadableFeeVai;
