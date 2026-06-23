import { QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { PublicClient } from 'viem';

import { useGetIsUserPrimeV2 } from '..';
import * as getIsUserPrimeV2Queries from '../..';

describe('useGetIsUserPrimeV2', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => true);
  });

  it('uses the expected query key and calls getIsUserPrimeV2 with the right parameters', async () => {
    const fakePublicClient = {
      readContract: vi.fn(),
    } as unknown as PublicClient;

    const fakeOutput = {
      isPrimeHolder: true,
    };

    const getIsUserPrimeV2Spy = vi
      .spyOn(getIsUserPrimeV2Queries, 'getIsUserPrimeV2')
      .mockResolvedValue(fakeOutput);

    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: fakePublicClient,
    }));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    const { result } = renderHook(
      () => useGetIsUserPrimeV2({ accountAddress: fakeAccountAddress }),
      {
        chainId: ChainId.BSC_MAINNET,
        queryClient,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getIsUserPrimeV2Spy).toHaveBeenCalledWith({
      accountAddress: fakeAccountAddress,
      primeV2ContractAddress: '0xfakePrimeV2ContractAddress',
      publicClient: fakePublicClient,
    });

    expect(
      queryClient.getQueryData([
        FunctionKey.GET_IS_USER_PRIME_V2,
        {
          accountAddress: fakeAccountAddress,
          chainId: ChainId.BSC_MAINNET,
        },
      ]),
    ).toEqual(fakeOutput);
  });

  it('does not fetch when Prime feature is disabled', async () => {
    const getIsUserPrimeV2Spy = vi.spyOn(getIsUserPrimeV2Queries, 'getIsUserPrimeV2');

    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: undefined,
    }));
    (useGetContractAddress as Mock).mockImplementation(() => ({
      address: '0xfakePrimeV2ContractAddress',
    }));

    const { result } = renderHook(() =>
      useGetIsUserPrimeV2({ accountAddress: fakeAccountAddress }),
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));

    expect(getIsUserPrimeV2Spy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
