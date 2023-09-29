import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from 'types';
import Vi from 'vitest';

import tokens from '__mocks__/models/tokens';
import { useAuth } from 'context/AuthContext';
import { getTokens } from 'packages/tokens/utilities/getTokens';

import { useGetTokens } from '..';

vi.mock('context/AuthContext');
vi.mock('packages/tokens/utilities/getTokens');

describe('useGetTokens', () => {
  beforeEach(() => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));
    (getTokens as Vi.Mock).mockImplementation(() => tokens);
  });

  it('returns tokens', () => {
    const { result } = renderHook(() => useGetTokens());

    expect(result.current).toBe(tokens);
    expect(getTokens).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
    });
  });
});
