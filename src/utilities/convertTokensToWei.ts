import BigNumber from 'bignumber.js';
import { Token } from 'types';

export const convertTokensToWei = ({ value, token }: { value: BigNumber; token: Token }) =>
  value.multipliedBy(new BigNumber(10).pow(token.decimals)).dp(0);

export default convertTokensToWei;
