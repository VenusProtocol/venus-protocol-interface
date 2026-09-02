import { QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import fakeAddress, { altAddress } from '__mocks__/models/address';
import FunctionKey from 'constants/functionKey';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import { useGetLiquidityHubOperatorAddress } from '..';
import * as getLiquidityHubOperatorAddressQueries from '../..';

describe('useGetLiquidityHubOperatorAddress', () => {
  it('uses the expected query key and calls getLiquidityHubOperatorAddress with the right parameters', async () => {
    const fakePublicClient = {
      readContract: vi.fn(),
    };

    const fakeOutput = {
      operatorAddress: altAddress as Address,
    };

    const getLiquidityHubOperatorAddressSpy = vi
      .spyOn(getLiquidityHubOperatorAddressQueries, 'getLiquidityHubOperatorAddress')
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
      () => useGetLiquidityHubOperatorAddress({ vhTokenAddress: fakeAddress }),
      {
        chainId: ChainId.BSC_MAINNET,
        queryClient,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getLiquidityHubOperatorAddressSpy).toHaveBeenCalledWith({
      publicClient: fakePublicClient,
      vhTokenAddress: fakeAddress,
    });

    expect(
      queryClient.getQueryData([
        FunctionKey.GET_LIQUIDITY_HUB_OPERATOR_ADDRESS,
        { chainId: ChainId.BSC_MAINNET, vhTokenAddress: fakeAddress },
      ]),
    ).toEqual(fakeOutput);
  });
});
