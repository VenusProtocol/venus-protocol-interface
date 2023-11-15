import BigNumber from 'bignumber.js';
import { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

const getReadableFeeVai = ({
  value,
  mintFeePercentage,
  vai,
}: {
  value: BigNumber;
  mintFeePercentage: number;
  vai: Token;
}) => {
  const feeMantissa = value.multipliedBy(mintFeePercentage).dividedBy(100);
  return convertMantissaToTokens({
    value: feeMantissa,
    token: vai,
    returnInReadableFormat: true,
  });
};

export default getReadableFeeVai;
