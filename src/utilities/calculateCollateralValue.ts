import BigNumber from 'bignumber.js';
import { Asset, Token } from 'types';
import { convertWeiToTokens } from 'utilities';

const calculateCollateralValue = ({
  token,
  tokenPriceTokens,
  collateralFactor,
  amountWei,
}: {
  token: Token;
  tokenPriceTokens: Asset['tokenPrice'];
  collateralFactor: Asset['collateralFactor'];
  amountWei: BigNumber;
}) => {
  const collateralValue = convertWeiToTokens({ valueWei: amountWei, token })
    .times(tokenPriceTokens)
    .times(collateralFactor);
  return collateralValue;
};

export default calculateCollateralValue;
