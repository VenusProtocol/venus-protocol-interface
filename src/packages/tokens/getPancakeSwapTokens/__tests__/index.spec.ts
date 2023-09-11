import { getPancakeSwapTokens } from '..';
import pancakeSwapTokens from '../../tokenInfos/pancakeSwap';

describe('getPancakeSwapTokens', () => {
  it('returns all the tokens relevant to the passed chain ID', () => {
    const CHAIN_ID = 56;
    const result = getPancakeSwapTokens({
      chainId: CHAIN_ID,
    });

    expect(result).toBe(pancakeSwapTokens[CHAIN_ID]);
  });
});
