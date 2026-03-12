import { poolData } from '__mocks__/models/pools';
import { useGetDsaVTokens, useGetPool } from 'clients/api';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import { useGetYieldPlusAssets } from '..';

describe('useGetYieldPlusAssets', () => {
  it('returns all asset lists at once only when both sources are ready', () => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolData[0],
      },
    }));

    (useGetDsaVTokens as Mock).mockImplementation(() => ({
      isLoading: true,
      data: undefined,
    }));

    const { result } = renderHook(() => useGetYieldPlusAssets());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual({
      borrowAssets: [],
      supplyAssets: [],
      dsaAssets: [],
    });
  });

  it('returns filtered dsaAssets together with borrowAssets and supplyAssets once ready', () => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolData[0],
      },
    }));

    (useGetDsaVTokens as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        // vXVS is supply-eligible, vUSDC is not supply-eligible in mock data
        dsaVTokenAddresses: [
          poolData[0].assets[0].vToken.address,
          poolData[0].assets[1].vToken.address,
        ] as Address[],
      },
    }));

    const { result } = renderHook(() => useGetYieldPlusAssets());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data.borrowAssets.map(asset => asset.vToken.address)).toEqual([
      poolData[0].assets[0].vToken.address,
      poolData[0].assets[2].vToken.address,
      poolData[0].assets[3].vToken.address,
    ]);
    expect(result.current.data.supplyAssets.map(asset => asset.vToken.address)).toEqual([
      poolData[0].assets[0].vToken.address,
      poolData[0].assets[2].vToken.address,
    ]);
    expect(result.current.data.dsaAssets.map(asset => asset.vToken.address)).toEqual([
      poolData[0].assets[0].vToken.address,
    ]);
  });

  it('returns empty arrays when dsa token list is unavailable, even if loading is finished', () => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolData[0],
      },
    }));

    (useGetDsaVTokens as Mock).mockImplementation(() => ({
      isLoading: false,
      data: undefined,
    }));

    const { result } = renderHook(() => useGetYieldPlusAssets());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({
      borrowAssets: [],
      supplyAssets: [],
      dsaAssets: [],
    });
  });
});
