import BigNumber from 'bignumber.js';

import { Asset, Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

const calculateCollateralValue = ({
  token,
  tokenPriceCents,
  collateralFactor,
  amountMantissa,
}: {
  token: Token;
  tokenPriceCents: Asset['tokenPriceCents'];
  collateralFactor: Asset['collateralFactor'];
  amountMantissa: BigNumber;
}) => {
  const collateralValue = convertMantissaToTokens({ value: amountMantissa, token })
    .times(tokenPriceCents)
    .times(collateralFactor);
  return collateralValue;
};

export default calculateCollateralValue;
