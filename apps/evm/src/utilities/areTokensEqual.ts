import type { Token, VToken, VhToken } from 'types';

export const areTokensEqual = (
  tokenA: Token | VToken | VhToken,
  tokenB: Token | VToken | VhToken,
) => tokenA.address.toLowerCase() === tokenB.address.toLowerCase();

export default areTokensEqual;
