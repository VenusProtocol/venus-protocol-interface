import { QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { PublicClient } from 'viem';

import { useGetPrimeVaultConfig } from '..';
import * as getPrimeVaultConfigQueries from '../..';

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
    },
  });

describe('useGetPrimeVaultConfig', () => {
  beforeEach(() => {
    (useGetContractAddress as Mock).mockImplementation(({ name }: { name: string }) => {
      if (name === 'PrimeV2') {
        return { address: '0xfakePrimeV2ContractAddress' };
      }

      return { address: '0xfakePrimeContractAddress' };
    });
  });

  it('reads the V1 Prime contract when Prime V2 is disabled', async () => {
    const fakeOutput = {
      poolIndex: 2,
      rewardTokenAddress: '0xfakeRewardTokenAddress' as const,
    };

    const getPrimeVaultConfigSpy = vi
      .spyOn(getPrimeVaultConfigQueries, 'getPrimeVaultConfig')
      .mockResolvedValue(fakeOutput);

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime',
    );
    (usePublicClient as Mock).mockReturnValue({
      publicClient: {} as PublicClient,
    });

    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useGetPrimeVaultConfig(), {
      chainId: ChainId.BSC_TESTNET,
      queryClient,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPrimeVaultConfigSpy).toHaveBeenCalledWith({
      primeContractAddress: '0xfakePrimeContractAddress',
      primeVersion: 1,
      publicClient: {} as PublicClient,
    });
    expect(
      queryClient.getQueryData([
        FunctionKey.GET_PRIME_VAULT_CONFIG,
        {
          chainId: ChainId.BSC_TESTNET,
          primeVersion: 1,
        },
      ]),
    ).toEqual(fakeOutput);
  });

  it('reads the V2 Prime contract when Prime V2 is enabled', async () => {
    const fakeOutput = {
      poolIndex: 4,
      rewardTokenAddress: '0xfakePrimeV2RewardTokenAddress' as const,
    };

    const getPrimeVaultConfigSpy = vi
      .spyOn(getPrimeVaultConfigQueries, 'getPrimeVaultConfig')
      .mockResolvedValue(fakeOutput);

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime' || name === 'primeLeaderboard',
    );
    (usePublicClient as Mock).mockReturnValue({
      publicClient: {} as PublicClient,
    });

    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useGetPrimeVaultConfig(), {
      chainId: ChainId.BSC_TESTNET,
      queryClient,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPrimeVaultConfigSpy).toHaveBeenCalledWith({
      primeContractAddress: '0xfakePrimeV2ContractAddress',
      primeVersion: 2,
      publicClient: {} as PublicClient,
    });
    expect(
      queryClient.getQueryData([
        FunctionKey.GET_PRIME_VAULT_CONFIG,
        {
          chainId: ChainId.BSC_TESTNET,
          primeVersion: 2,
        },
      ]),
    ).toEqual(fakeOutput);
  });
});
