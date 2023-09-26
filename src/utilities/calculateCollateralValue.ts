import BigNumber from 'bignumber.js';
import { Asset, Token } from 'types';

import { convertWeiToTokens } from './convertWeiToTokens';

export const calculateCollateralValue = ({
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
  const collateralValue = convertWeiToTokens({ valueWei: amountWei, token })
    .times(tokenPriceCents)
    .times(collateralFactor);
  return collateralValue;
};
