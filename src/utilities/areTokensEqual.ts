import { Token, VToken } from 'types';

export const areTokensEqual = (tokenA: Token | VToken, tokenB: Token | VToken) =>
  tokenA.address.toLowerCase() === tokenB.address.toLowerCase();

export default areTokensEqual;
