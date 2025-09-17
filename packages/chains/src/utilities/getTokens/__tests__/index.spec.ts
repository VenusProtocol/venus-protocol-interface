import { getTokens } from '..';
import { tokens } from '../../../tokenMetadata/tokens';
import { ChainId } from '../../../types';

describe('getTokens', () => {
  it('returns all the tokens relevant to the passed chain ID', () => {
    const result = getTokens({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result).toBe(tokens[ChainId.BSC_TESTNET]);
  });
});
