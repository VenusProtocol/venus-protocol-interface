import fakeAddress from '__mocks__/models/address';
import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import { useGetYieldPlusPositions } from 'hooks/useGetYieldPlusPositions';
import { useAccountAddress } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Token, YieldPlusPosition } from 'types';
import type { Mock } from 'vitest';

import { useGetSelectedYieldPlusPosition } from '..';
import { useTokenPair } from '../../useTokenPair';

vi.mock('hooks/useGetYieldPlusPositions', () => ({
  useGetYieldPlusPositions: vi.fn(),
}));

vi.mock('../../useTokenPair', () => ({
  useTokenPair: vi.fn(),
}));

const selectedPosition = yieldPlusPositions[0];
const alternativePosition = yieldPlusPositions[2];

const setHookState = ({
  accountAddress = fakeAddress,
  longToken = selectedPosition.longAsset.vToken.underlyingToken,
  shortToken = selectedPosition.shortAsset.vToken.underlyingToken,
  isLoading = false,
  getYieldPlusPositionsData,
}: {
  accountAddress?: string;
  longToken?: Token;
  shortToken?: Token;
  isLoading?: boolean;
  getYieldPlusPositionsData?: {
    positions: YieldPlusPosition[];
  };
} = {}) => {
  const data = getYieldPlusPositionsData ?? {
    positions: yieldPlusPositions,
  };

  (useAccountAddress as Mock).mockImplementation(() => ({
    accountAddress,
  }));

  (useTokenPair as Mock).mockImplementation(() => ({
    longToken,
    shortToken,
  }));

  (useGetYieldPlusPositions as Mock).mockImplementation(() => ({
    data,
    isLoading,
  }));
};

describe('useGetSelectedYieldPlusPosition', () => {
  beforeEach(() => {
    setHookState();
  });

  it('passes the connected wallet address to useGetYieldPlusPositions', () => {
    renderHook(() => useGetSelectedYieldPlusPosition());

    expect(useGetYieldPlusPositions).toHaveBeenCalledWith({
      accountAddress: fakeAddress,
    });
  });

  it('returns the selected position when the token pair matches', () => {
    const { result } = renderHook(() => useGetSelectedYieldPlusPosition());

    expect(result.current).toEqual({
      data: {
        position: selectedPosition,
      },
      isLoading: false,
    });
  });

  it('returns undefined data when no position matches the selected token pair', () => {
    setHookState({
      getYieldPlusPositionsData: {
        positions: [selectedPosition],
      },
      longToken: alternativePosition.longAsset.vToken.underlyingToken,
      shortToken: alternativePosition.shortAsset.vToken.underlyingToken,
    });

    const { result } = renderHook(() => useGetSelectedYieldPlusPosition());

    expect(result.current).toEqual({
      data: undefined,
      isLoading: false,
    });
  });

  it('returns undefined data when positions are unavailable and preserves query state', () => {
    setHookState({
      isLoading: true,
    });

    (useGetYieldPlusPositions as Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }));

    const { result } = renderHook(() => useGetSelectedYieldPlusPosition());

    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
    });
  });
});
