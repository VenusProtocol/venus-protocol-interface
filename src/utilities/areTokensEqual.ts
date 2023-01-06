import { Token } from 'types';

export const areTokensEqual = (tokenA: Token, tokenB: Token) =>
  tokenA.address.toLowerCase() === tokenB.address.toLowerCase();

export default areTokensEqual;
