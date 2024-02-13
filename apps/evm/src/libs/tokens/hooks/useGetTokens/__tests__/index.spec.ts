import Vi from 'vitest';

import tokens from '__mocks__/models/tokens';
import { renderHook } from 'testUtils/render';

import { getTokens } from 'libs/tokens/utilities/getTokens';
import { ChainId } from 'types';

import { useGetTokens } from '..';

vi.mock('libs/tokens/utilities/getTokens');

describe('useGetTokens', () => {
  beforeEach(() => {
    (getTokens as Vi.Mock).mockImplementation(() => tokens);
  });

  it('returns tokens of the current chain', () => {
    const { result } = renderHook(() => useGetTokens(), {
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result.current).toBe(tokens);
    expect(getTokens).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
    });
  });

  it('passes chainId parameter to getTokens when passed through input', () => {
    const { result } = renderHook(
      () =>
        useGetTokens({
          chainId: ChainId.SEPOLIA,
        }),
      {
        chainId: ChainId.BSC_TESTNET,
      },
    );

    expect(result.current).toBe(tokens);
    expect(getTokens).toHaveBeenCalledWith({
      chainId: ChainId.SEPOLIA,
    });
  });
});
