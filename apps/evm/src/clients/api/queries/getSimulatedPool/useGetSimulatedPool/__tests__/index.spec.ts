import { QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { usePrimeVersion } from 'hooks/usePrimeVersion';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { PublicClient } from 'viem';

import { useGetSimulatedPool } from '..';
import * as getSimulatedPoolQueries from '../..';

vi.mock('hooks/usePrimeVersion');

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
    },
  });

describe('useGetSimulatedPool', () => {
  beforeEach(() => {
    (useGetContractAddress as Mock).mockImplementation(({ name }: { name: string }) => {
      if (name === 'PrimeV2Lens') {
        return { address: '0xfakePrimeV2LensContractAddress' };
      }

      return { address: '0xfakePrimeContractAddress' };
    });
    (usePublicClient as Mock).mockReturnValue({
      publicClient: {} as PublicClient,
    });
  });

  it('passes the V1 Prime contract as the APR source when Prime V2 is disabled', async () => {
    (usePrimeVersion as Mock).mockReturnValue({
      primeVersion: 1,
    });

    const getSimulatedPoolSpy = vi
      .spyOn(getSimulatedPoolQueries, 'getSimulatedPool')
      .mockResolvedValue({ pool: undefined });

    const { result } = renderHook(
      () =>
        useGetSimulatedPool(
          {
            balanceMutations: [],
            pool: undefined,
          },
          undefined,
        ),
      {
        chainId: ChainId.BSC_TESTNET,
        queryClient: makeQueryClient(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getSimulatedPoolSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        primeAprContractAddress: '0xfakePrimeContractAddress',
        primeVersion: 1,
      }),
    );
  });

  it('passes the V2 lens contract as the APR source when Prime V2 is enabled', async () => {
    (usePrimeVersion as Mock).mockReturnValue({
      primeVersion: 2,
    });

    const getSimulatedPoolSpy = vi
      .spyOn(getSimulatedPoolQueries, 'getSimulatedPool')
      .mockResolvedValue({ pool: undefined });

    const { result } = renderHook(
      () =>
        useGetSimulatedPool(
          {
            balanceMutations: [],
            pool: undefined,
          },
          undefined,
        ),
      {
        chainId: ChainId.BSC_TESTNET,
        queryClient: makeQueryClient(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getSimulatedPoolSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        primeAprContractAddress: '0xfakePrimeV2LensContractAddress',
        primeVersion: 2,
      }),
    );
  });
});
