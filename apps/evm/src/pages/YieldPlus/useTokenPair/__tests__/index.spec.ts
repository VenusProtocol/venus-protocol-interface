import fakeAddress from '__mocks__/models/address';
import { busd, usdc, usdt, wbnb } from '__mocks__/models/tokens';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useSearchParams } from 'react-router';
import { renderHook } from 'testUtils/render';
import type { Token } from 'types';
import type { Mock } from 'vitest';

import { useTokenPair } from '..';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../../constants';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as object;

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

const mockSetSearchParams = vi.fn();

const availableTokens = [busd, usdc, usdt];

const setHookState = (
  input: {
    searchParams?: URLSearchParams;
    tokens?: Token[];
    getTokenResults?: {
      USDT?: Token | undefined;
      WBNB?: Token | undefined;
    };
  } = {},
) => {
  const { searchParams = new URLSearchParams(), tokens = availableTokens } = input;
  const resolvedGetTokenResults = {
    USDT: usdt,
    WBNB: wbnb,
    ...input.getTokenResults,
  };

  mockSetSearchParams.mockReset();

  (useSearchParams as Mock).mockImplementation(() => [searchParams, mockSetSearchParams]);
  (useGetTokens as Mock).mockImplementation(() => tokens);
  (useGetToken as Mock).mockImplementation(
    ({ symbol }: { symbol: 'USDT' | 'WBNB' }) => resolvedGetTokenResults[symbol],
  );
};

describe('useTokenPair', () => {
  beforeEach(() => {
    setHookState();
  });

  it('returns the token pair from search params when both addresses match known tokens', () => {
    setHookState({
      searchParams: new URLSearchParams({
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: busd.address,
        [SHORT_TOKEN_ADDRESS_PARAM_KEY]: usdc.address,
      }),
    });

    const { result } = renderHook(() => useTokenPair());

    expect(useGetToken).toHaveBeenCalledWith({
      symbol: 'USDT',
    });
    expect(useGetToken).toHaveBeenCalledWith({
      symbol: 'WBNB',
    });
    expect(result.current).toEqual({
      defaultLongToken: usdt,
      defaultShortToken: wbnb,
      longToken: busd,
      shortToken: usdc,
    });
  });

  it('returns the default token pair when no search params are set', () => {
    const { result } = renderHook(() => useTokenPair());

    expect(result.current).toEqual({
      defaultLongToken: usdt,
      defaultShortToken: wbnb,
      longToken: usdt,
      shortToken: wbnb,
    });
  });

  it('returns the default token pair when only one token address param is set', () => {
    setHookState({
      searchParams: new URLSearchParams({
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: busd.address,
      }),
    });

    const { result } = renderHook(() => useTokenPair());

    expect(result.current).toEqual({
      defaultLongToken: usdt,
      defaultShortToken: wbnb,
      longToken: usdt,
      shortToken: wbnb,
    });
  });

  it('returns the default token pair when one token address does not match any known token', () => {
    setHookState({
      searchParams: new URLSearchParams({
        [LONG_TOKEN_ADDRESS_PARAM_KEY]: busd.address,
        [SHORT_TOKEN_ADDRESS_PARAM_KEY]: fakeAddress,
      }),
    });

    const { result } = renderHook(() => useTokenPair());

    expect(result.current).toEqual({
      defaultLongToken: usdt,
      defaultShortToken: wbnb,
      longToken: usdt,
      shortToken: wbnb,
    });
  });

  it('falls back to the first available token when USDT is unavailable', () => {
    setHookState({
      tokens: [busd, usdc],
      getTokenResults: {
        USDT: undefined,
      },
    });

    const { result } = renderHook(() => useTokenPair());

    expect(result.current).toEqual({
      defaultLongToken: busd,
      defaultShortToken: wbnb,
      longToken: busd,
      shortToken: wbnb,
    });
  });

  it('falls back to the second available token when WBNB is unavailable', () => {
    setHookState({
      getTokenResults: {
        WBNB: undefined,
      },
    });

    const { result } = renderHook(() => useTokenPair());

    expect(result.current).toEqual({
      defaultLongToken: usdt,
      defaultShortToken: usdc,
      longToken: usdt,
      shortToken: usdc,
    });
  });
});
