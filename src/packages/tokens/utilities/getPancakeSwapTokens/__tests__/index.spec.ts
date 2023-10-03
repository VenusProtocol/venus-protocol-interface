import { pancakeSwapTokens } from 'packages/tokens/tokenInfos/pancakeSwapTokens';
import { ChainId } from 'types';

import { getPancakeSwapTokens } from '..';

describe('getPancakeSwapTokens', () => {
  it('returns all the tokens relevant to the passed chain ID', () => {
    const result = getPancakeSwapTokens({
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result).toBe(pancakeSwapTokens[ChainId.BSC_TESTNET]);
  });
});
