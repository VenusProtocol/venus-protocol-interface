import BigNumber from 'bignumber.js';
import { TokenId } from 'types';
import { getToken } from 'utilities';

export const convertTokensToWei = ({ value, tokenId }: { value: BigNumber; tokenId: TokenId }) => {
  const tokenDecimals = getToken(tokenId).decimals;
  return value.multipliedBy(new BigNumber(10).pow(tokenDecimals));
};

export default convertTokensToWei;
