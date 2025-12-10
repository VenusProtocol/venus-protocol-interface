import { chains } from '@venusprotocol/chains';

import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { useChain } from '..';

describe('useChain', () => {
  it('returns the correct chain metadata', () => {
    const { result } = renderHook(() => useChain());

    expect(result.current).toMatchObject(chains[ChainId.BSC_TESTNET]);
  });
});
