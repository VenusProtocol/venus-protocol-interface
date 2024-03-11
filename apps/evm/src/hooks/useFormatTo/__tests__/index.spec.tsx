import type Vi from 'vitest';

import { renderHook } from 'testUtils/render';

import { useChainId } from 'libs/wallet';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { ChainId } from 'types';

import { useFormatTo } from '..';

describe('useFormatTo', () => {
  beforeEach(() => {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: ChainId.BSC_TESTNET,
    }));
  });

  it('formats string with existing query', () => {
    const { result } = renderHook(() => useFormatTo());
    const formattedTo = result.current.formatTo({ to: '/path?param=value' });

    expect(formattedTo).toEqual({
      pathname: '/path',
      search: `?param=value&${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    });
  });

  it('formats string without query', () => {
    const { result } = renderHook(() => useFormatTo());
    const formattedTo = result.current.formatTo({ to: '/path' });

    expect(formattedTo).toEqual({
      pathname: '/path',
      search: `?${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    });
  });

  it('formats object with search property', () => {
    const { result } = renderHook(() => useFormatTo());
    const formattedTo = result.current.formatTo({
      to: { pathname: '/path', search: 'param=value' },
    });

    expect(formattedTo).toEqual({
      pathname: '/path',
      search: `?param=value&${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    });
  });

  it('formats object without search property', () => {
    const { result } = renderHook(() => useFormatTo());
    const formattedTo = result.current.formatTo({ to: { pathname: '/path' } });

    expect(formattedTo).toEqual({
      pathname: '/path',
      search: `?${CHAIN_ID_SEARCH_PARAM}=${ChainId.BSC_TESTNET}`,
    });
  });
});
