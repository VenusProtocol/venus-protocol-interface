import { useChainId } from 'libs/wallet';
import Vi from 'vitest';

import { renderHook } from 'testUtils/render';

import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ChainId } from 'types';

import { useGetChainMetadata } from '..';

describe('useGetChainMetadata', () => {
  it('returns the correct chain metadata', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => useGetChainMetadata());

    expect(result.current).toBe(CHAIN_METADATA[ChainId.BSC_TESTNET]);
  });
});
