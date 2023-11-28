import Vi from 'vitest';

import tokens from '__mocks__/models/tokens';
import { renderHook } from 'testUtils/render';

import { getTokens } from 'packages/tokens/utilities/getTokens';
import { ChainId } from 'types';

import { useGetTokens } from '..';

vi.mock('packages/tokens/utilities/getTokens');

describe('useGetTokens', () => {
  beforeEach(() => {
    (getTokens as Vi.Mock).mockImplementation(() => tokens);
  });

  it('returns tokens', () => {
    const { result } = renderHook(() => useGetTokens(), {
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result.current).toBe(tokens);
    expect(getTokens).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
    });
  });
});
