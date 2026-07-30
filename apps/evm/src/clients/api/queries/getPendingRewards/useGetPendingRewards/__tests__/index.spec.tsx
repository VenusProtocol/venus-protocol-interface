import { useQuery } from '@tanstack/react-query';
import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import tokens from '__mocks__/models/tokens';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { usePrimeVersion } from 'hooks/usePrimeVersion';
import { useGetTokens } from 'libs/tokens';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import { type Mock, vi } from 'vitest';
import { useGetPendingRewards } from '..';
import { useGetLiquidityHubs } from '../../../getLiquidityHubs/useGetLiquidityHubs';
import { useGetXvsVaultPoolCount } from '../../../getXvsVaultPoolCount/useGetXvsVaultPoolCount';
import { useGetPools } from '../../../useGetPools';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');

  return {
    ...actual,
    useQuery: vi.fn(queryOptions => queryOptions),
  };
});

vi.mock('../../../useGetPools', () => ({
  useGetPools: vi.fn(),
}));

vi.mock('../../../getLiquidityHubs/useGetLiquidityHubs', () => ({
  useGetLiquidityHubs: vi.fn(),
}));

vi.mock('../../../getXvsVaultPoolCount/useGetXvsVaultPoolCount', () => ({
  useGetXvsVaultPoolCount: vi.fn(),
}));

vi.mock('hooks/usePrimeVersion', () => ({
  usePrimeVersion: vi.fn(),
}));

describe('useGetPendingRewards', () => {
  beforeEach(() => {
    (useGetPools as Mock).mockReturnValue({
      data: {
        pools: poolData,
      },
      isLoading: false,
    });
    (useGetLiquidityHubs as Mock).mockReturnValue({
      data: {
        liquidityHubs,
      },
      isLoading: false,
    });
    (useGetXvsVaultPoolCount as Mock).mockReturnValue({
      data: {
        poolCount: 1,
      },
      isLoading: false,
    });
    (useGetContractAddress as Mock).mockReturnValue({
      address: '0x1000000000000000000000000000000000000001' as Address,
    });
    (usePrimeVersion as Mock).mockReturnValue({ primeVersion: 1 });
    (useGetTokens as Mock).mockReturnValue(tokens);
    (usePublicClient as Mock).mockReturnValue({ publicClient: {} });
  });

  it.each([
    ['no options', undefined, true],
    ['enabled', { enabled: true }, true],
    ['disabled', { enabled: false }, false],
  ] as const)('sets dependent query enabled option when %s', (_, options, expectedEnabled) => {
    renderHook(() =>
      useGetPendingRewards(
        {
          accountAddress: fakeAccountAddress,
        },
        options,
      ),
    );

    expect(useGetPools).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
      },
      {
        enabled: expectedEnabled,
      },
    );
    expect(useGetLiquidityHubs).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
      },
      {
        enabled: expectedEnabled,
      },
    );
    expect(useGetXvsVaultPoolCount).toHaveBeenCalledWith({
      enabled: expectedEnabled,
    });
  });

  it('keeps the pending rewards query disabled while dependent queries are loading', () => {
    (useGetPools as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderHook(() =>
      useGetPendingRewards(
        {
          accountAddress: fakeAccountAddress,
        },
        {
          enabled: true,
        },
      ),
    );

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });
});
