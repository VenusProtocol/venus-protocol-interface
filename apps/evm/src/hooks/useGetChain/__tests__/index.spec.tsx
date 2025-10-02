import { chains } from '@venusprotocol/chains';

import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { useGetChain } from '..';

describe('useGetChain', () => {
  it('returns the correct chain metadata', () => {
    const { result } = renderHook(() => useGetChain());

    expect(result.current).toBe(chains[ChainId.BSC_TESTNET]);
  });
});
