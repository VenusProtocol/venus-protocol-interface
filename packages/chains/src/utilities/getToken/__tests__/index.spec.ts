import { getToken } from '..';
import { tokens } from '../../../tokens/underlyingTokens';
import { ChainId } from '../../../types';

describe('getToken', () => {
  it('return a single token from a chain, given its symbol', () => {
    const result = getToken({
      chainId: ChainId.BSC_TESTNET,
      symbol: 'BNB',
    });

    expect(result).toBe(tokens[ChainId.BSC_TESTNET][0]);
  });
});
