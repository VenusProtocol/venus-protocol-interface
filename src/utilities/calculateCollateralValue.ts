import BigNumber from 'bignumber.js';
import { Asset, Token } from 'types';
import { convertWeiToTokens } from 'utilities';

const calculateCollateralValue = ({
  token,
  tokenPriceCents,
  collateralFactor,
  amountWei,
}: {
  token: Token;
  tokenPriceCents: Asset['tokenPriceCents'];
  collateralFactor: Asset['collateralFactor'];
  amountWei: BigNumber;
}) => {
  const collateralValue = convertWeiToTokens({ value: amountWei, token })
    .times(tokenPriceCents)
    .times(collateralFactor);
  return collateralValue;
};

export default calculateCollateralValue;
