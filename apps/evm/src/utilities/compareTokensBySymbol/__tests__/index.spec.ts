import type { Token } from 'types';

import compareTokensBySymbol from '..';

const token = (symbol: string) => ({ symbol }) as unknown as Token;

describe('compareTokensBySymbol', () => {
  it('orders tokens alphabetically (A→Z) by symbol', () => {
    const sorted = [token('WBNB'), token('USDT'), token('BTCB')].sort(compareTokensBySymbol);
    expect(sorted.map(({ symbol }) => symbol)).toEqual(['BTCB', 'USDT', 'WBNB']);
  });

  it('breaks ties on the next differing letter', () => {
    const sorted = [token('USDT'), token('USDC')].sort(compareTokensBySymbol);
    expect(sorted.map(({ symbol }) => symbol)).toEqual(['USDC', 'USDT']);
  });

  it('produces the same order regardless of input order', () => {
    const fromOrderA = [token('WBNB'), token('USDT')].sort(compareTokensBySymbol);
    const fromOrderB = [token('USDT'), token('WBNB')].sort(compareTokensBySymbol);
    expect(fromOrderA.map(({ symbol }) => symbol)).toEqual(fromOrderB.map(({ symbol }) => symbol));
  });
});
