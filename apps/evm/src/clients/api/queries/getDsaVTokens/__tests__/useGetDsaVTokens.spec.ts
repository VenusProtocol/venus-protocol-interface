import { QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import fakeAddress from '__mocks__/models/address';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import * as getDsaVTokensQueries from '..';
import { useGetDsaVTokens } from '../useGetDsaVTokens';

describe('useGetDsaVTokens', () => {
  it('uses the expected query key and calls getDsaVTokens with the right parameters', async () => {
    const fakePublicClient = {
      readContract: vi.fn(),
    };

    const fakeOutput = {
      dsaVTokenAddresses: [fakeAddress as Address],
    };

    const getDsaVTokensSpy = vi
      .spyOn(getDsaVTokensQueries, 'getDsaVTokens')
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

    const { result } = renderHook(() => useGetDsaVTokens(), {
      chainId: ChainId.BSC_MAINNET,
      queryClient,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getDsaVTokensSpy).toHaveBeenCalledWith({
      publicClient: fakePublicClient,
      relativePositionManagerAddress: '0xfakeRelativePositionManagerContractAddress',
    });

    expect(
      queryClient.getQueryData([FunctionKey.GET_DSA_V_TOKENS, { chainId: ChainId.BSC_MAINNET }]),
    ).toEqual(fakeOutput);
  });

  it('throws when relativePositionManagerAddress is missing', async () => {
    const getDsaVTokensSpy = vi.spyOn(getDsaVTokensQueries, 'getDsaVTokens');

    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    const { result } = renderHook(() => useGetDsaVTokens());

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('couldNotRetrieveSigner');
    expect(getDsaVTokensSpy).not.toHaveBeenCalled();
  });
});
