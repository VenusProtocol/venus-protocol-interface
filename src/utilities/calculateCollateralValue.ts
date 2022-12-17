import BigNumber from 'bignumber.js';
import { Asset, Token } from 'types';
import { convertWeiToTokens } from 'utilities';

const calculateCollateralValue = ({
  token,
  tokenPriceDollars,
  collateralFactor,
  amountWei,
}: {
  token: Token;
  tokenPriceDollars: Asset['tokenPriceDollars'];
  collateralFactor: Asset['collateralFactor'];
  amountWei: BigNumber;
}) => {
  const collateralValue = convertWeiToTokens({ valueWei: amountWei, token })
    .times(tokenPriceDollars)
    .times(collateralFactor);
  return collateralValue;
};

export default calculateCollateralValue;
