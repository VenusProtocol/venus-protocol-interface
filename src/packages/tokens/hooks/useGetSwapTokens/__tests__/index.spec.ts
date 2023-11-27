import { ChainId } from 'types';
import Vi from 'vitest';

import tokens from '__mocks__/models/tokens';
import { getSwapTokens } from 'packages/tokens/utilities/getSwapTokens';
import { renderHook } from 'testUtils/render';

import { useGetSwapTokens } from '..';

vi.mock('packages/tokens/utilities/getSwapTokens');

describe('useGetSwapTokens', () => {
  beforeEach(() => {
    (getSwapTokens as Vi.Mock).mockImplementation(() => tokens);
  });

  it('returns swap tokens', () => {
    const { result } = renderHook(() => useGetSwapTokens(), {
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result.current).toBe(tokens);
    expect(getSwapTokens).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
    });
  });
});
