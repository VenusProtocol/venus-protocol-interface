import { ChainId } from 'types';
import Vi from 'vitest';

import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useAuth } from 'context/AuthContext';
import { renderHook } from 'testUtils/render';

import { useGetChainMetadata } from '..';

vi.mock('context/AuthContext');

describe('useGetChainMetadata', () => {
  it('returns the correct chain metadata', () => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => useGetChainMetadata());

    expect(result.current).toBe(CHAIN_METADATA[ChainId.BSC_TESTNET]);
  });
});
