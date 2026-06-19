import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { bnb } from '__mocks__/models/tokens';
import { useGetDsaVTokens, useGetPool } from 'clients/api';
import { useChain } from 'hooks/useChain';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import { useGetTradeAssets } from '..';

vi.mock('clients/api', () => ({
  useGetDsaVTokens: vi.fn(),
  useGetPool: vi.fn(),
}));

vi.mock('hooks/useChain', () => ({
  useChain: vi.fn(),
}));

describe('useGetTradeAssets', () => {
  beforeEach(() => {
    (useChain as Mock).mockReturnValue({
      corePoolComptrollerContractAddress: fakeAddress,
    });
  });

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

    const { result } = renderHook(() => useGetTradeAssets());

    expect(useGetPool).toHaveBeenCalledWith({
      accountAddress: undefined,
      poolComptrollerAddress: fakeAddress,
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual({
      borrowAssets: [],
      supplyAssets: [],
      dsaAssets: [],
    });
  });

  it('filters out native assets from borrowAssets and supplyAssets once ready', () => {
    const poolWithNativeAsset = {
      ...poolData[0],
      assets: [
        {
          ...poolData[0].assets[0],
          vToken: {
            ...poolData[0].assets[0].vToken,
            underlyingToken: bnb,
          },
        },
        {
          ...poolData[0].assets[1],
          disabledTokenActions: [],
        },
        poolData[0].assets[2],
      ],
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolWithNativeAsset,
      },
    }));

    (useGetDsaVTokens as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        dsaVTokenAddresses: [
          poolWithNativeAsset.assets[1].vToken.address,
          poolWithNativeAsset.assets[2].vToken.address,
        ] as Address[],
      },
    }));

    const { result } = renderHook(() =>
      useGetTradeAssets({
        accountAddress: fakeAddress,
      }),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data.borrowAssets.map(asset => asset.vToken.address)).toEqual(
      poolWithNativeAsset.assets.slice(1).map(asset => asset.vToken.address),
    );
    expect(result.current.data.supplyAssets.map(asset => asset.vToken.address)).toEqual(
      poolWithNativeAsset.assets.slice(1).map(asset => asset.vToken.address),
    );
    expect(result.current.data.dsaAssets.map(asset => asset.vToken.address)).toEqual([
      poolWithNativeAsset.assets[1].vToken.address,
      poolWithNativeAsset.assets[2].vToken.address,
    ]);
    expect(useGetPool).toHaveBeenCalledWith({
      accountAddress: fakeAddress,
      poolComptrollerAddress: fakeAddress,
    });
  });

  it('filters out DSA assets that cannot be supplied or used as collateral', () => {
    const poolWithIneligibleDsaAssets = {
      ...poolData[0],
      assets: [
        {
          ...poolData[0].assets[0],
          collateralFactor: 0,
        },
        poolData[0].assets[1],
        poolData[0].assets[2],
      ],
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolWithIneligibleDsaAssets,
      },
    }));

    (useGetDsaVTokens as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        dsaVTokenAddresses: poolWithIneligibleDsaAssets.assets.map(asset => asset.vToken.address),
      },
    }));

    const { result } = renderHook(() => useGetTradeAssets());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data.dsaAssets.map(asset => asset.vToken.address)).toEqual([
      poolWithIneligibleDsaAssets.assets[2].vToken.address,
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

    const { result } = renderHook(() => useGetTradeAssets());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({
      borrowAssets: [],
      supplyAssets: [],
      dsaAssets: [],
    });
  });
});
