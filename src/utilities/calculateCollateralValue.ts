import BigNumber from 'bignumber.js';
import { Asset } from 'types';
import { convertWeiToTokens } from 'utilities';

const calculateCollateralValue = ({
  tokenId,
  tokenPriceTokens,
  collateralFactor,
  amountWei,
}: {
  tokenId: Asset['id'];
  tokenPriceTokens: Asset['tokenPrice'];
  collateralFactor: Asset['collateralFactor'];
  amountWei: BigNumber;
}) => {
  const collateralValue = convertWeiToTokens({ valueWei: amountWei, tokenId })
    .times(tokenPriceTokens)
    .times(collateralFactor);
  return collateralValue;
};

export default calculateCollateralValue;
