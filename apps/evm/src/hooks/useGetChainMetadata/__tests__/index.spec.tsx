import { chainMetadata } from '@venusprotocol/registry';

import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { useGetChainMetadata } from '..';

describe('useGetChainMetadata', () => {
  it('returns the correct chain metadata', () => {
    const { result } = renderHook(() => useGetChainMetadata());

    expect(result.current).toBe(chainMetadata[ChainId.BSC_TESTNET]);
  });
});
