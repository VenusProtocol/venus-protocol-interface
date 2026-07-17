import type { Token } from 'types';

import compareStrings from './compareStrings';

// Stable alphabetical (A→Z) ordering of tokens by symbol, so lists driven by backend order
// (e.g. reward-magnitude order) don't reshuffle between refreshes.
const compareTokensBySymbol = (tokenA: Token, tokenB: Token): number =>
  compareStrings(tokenA.symbol, tokenB.symbol, 'asc');

export default compareTokensBySymbol;
