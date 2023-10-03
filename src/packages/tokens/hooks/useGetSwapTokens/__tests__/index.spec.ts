import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from 'types';
import Vi from 'vitest';

import tokens from '__mocks__/models/tokens';
import { useAuth } from 'context/AuthContext';
import { getSwapTokens } from 'packages/tokens/utilities/getSwapTokens';

import { useGetSwapTokens } from '..';

vi.mock('context/AuthContext');
vi.mock('packages/tokens/utilities/getSwapTokens');

describe('useGetSwapTokens', () => {
  beforeEach(() => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));
    (getSwapTokens as Vi.Mock).mockImplementation(() => tokens);
  });

  it('returns swap tokens', () => {
    const { result } = renderHook(() => useGetSwapTokens());

    expect(result.current).toBe(tokens);
    expect(getSwapTokens).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
    });
  });
});
