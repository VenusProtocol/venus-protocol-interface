import fakeAddress from '__mocks__/models/address';
import { tradePositions } from '__mocks__/models/trade';
import { useGetTradePositions } from 'hooks/useGetTradePositions';
import { useAccountAddress } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Token, TradePosition } from 'types';
import type { Mock } from 'vitest';

import { useGetSelectedTradePosition } from '..';
import { useTokenPair } from '../../useTokenPair';

vi.mock('hooks/useGetTradePositions', () => ({
  useGetTradePositions: vi.fn(),
}));

vi.mock('../../useTokenPair', () => ({
  useTokenPair: vi.fn(),
}));

const selectedPosition = tradePositions[0];
const alternativePosition = tradePositions[2];

const setHookState = ({
  accountAddress = fakeAddress,
  longToken = selectedPosition.longAsset.vToken.underlyingToken,
  shortToken = selectedPosition.shortAsset.vToken.underlyingToken,
  isLoading = false,
  getTradePositionsData,
}: {
  accountAddress?: string;
  longToken?: Token;
  shortToken?: Token;
  isLoading?: boolean;
  getTradePositionsData?: {
    positions: TradePosition[];
  };
} = {}) => {
  const data = getTradePositionsData ?? {
    positions: tradePositions,
  };

  (useAccountAddress as Mock).mockImplementation(() => ({
    accountAddress,
  }));

  (useTokenPair as Mock).mockImplementation(() => ({
    longToken,
    shortToken,
  }));

  (useGetTradePositions as Mock).mockImplementation(() => ({
    data,
    isLoading,
  }));
};

describe('useGetSelectedTradePosition', () => {
  beforeEach(() => {
    setHookState();
  });

  it('passes the connected wallet address to useGetTradePositions', () => {
    renderHook(() => useGetSelectedTradePosition());

    expect(useGetTradePositions).toHaveBeenCalledWith({
      accountAddress: fakeAddress,
    });
  });

  it('returns the selected position when the token pair matches', () => {
    const { result } = renderHook(() => useGetSelectedTradePosition());

    expect(result.current).toEqual({
      data: {
        position: selectedPosition,
      },
      isLoading: false,
    });
  });

  it('returns undefined data when no position matches the selected token pair', () => {
    setHookState({
      getTradePositionsData: {
        positions: [selectedPosition],
      },
      longToken: alternativePosition.longAsset.vToken.underlyingToken,
      shortToken: alternativePosition.shortAsset.vToken.underlyingToken,
    });

    const { result } = renderHook(() => useGetSelectedTradePosition());

    expect(result.current).toEqual({
      data: undefined,
      isLoading: false,
    });
  });

  it('returns undefined data when positions are unavailable and preserves query state', () => {
    setHookState({
      isLoading: true,
    });

    (useGetTradePositions as Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }));

    const { result } = renderHook(() => useGetSelectedTradePosition());

    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
    });
  });
});
