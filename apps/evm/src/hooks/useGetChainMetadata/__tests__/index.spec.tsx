import type Vi from 'vitest';

import { renderHook } from 'testUtils/render';

import { ChainId } from '@venusprotocol/chains';
import { chainMetadata } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';

import { useGetChainMetadata } from '..';

describe('useGetChainMetadata', () => {
  it('returns the correct chain metadata', () => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));

    const { result } = renderHook(() => useGetChainMetadata());

    expect(result.current).toBe(chainMetadata[ChainId.BSC_TESTNET]);
  });
});
