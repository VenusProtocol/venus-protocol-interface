import { QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import FunctionKey from 'constants/functionKey';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { useGetLiquidityHubs } from '..';
import * as getLiquidityHubsQueries from '../..';

const fakeOutput: getLiquidityHubsQueries.GetLiquidityHubsOutput = {
  liquidityHubs: [],
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

describe('useGetLiquidityHubs', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'liquidityHub',
    );
  });

  it('fetches liquidity hubs when the Liquidity Hub feature is enabled on the current chain', async () => {
    const getLiquidityHubsSpy = vi
      .spyOn(getLiquidityHubsQueries, 'getLiquidityHubs')
      .mockResolvedValue(fakeOutput);

    const queryClient = createQueryClient();

    const { result } = renderHook(
      () => useGetLiquidityHubs({ accountAddress: fakeAccountAddress }),
      {
        chainId: ChainId.BSC_MAINNET,
        queryClient,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getLiquidityHubsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        chainId: ChainId.BSC_MAINNET,
        accountAddress: fakeAccountAddress,
      }),
    );

    expect(
      queryClient.getQueryData([
        FunctionKey.GET_LIQUIDITY_HUBS,
        {
          chainId: ChainId.BSC_MAINNET,
          accountAddress: fakeAccountAddress,
        },
      ]),
    ).toEqual(fakeOutput);
  });

  it('does not fetch when the Liquidity Hub feature is disabled on the current chain', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name !== 'liquidityHub',
    );

    const getLiquidityHubsSpy = vi.spyOn(getLiquidityHubsQueries, 'getLiquidityHubs');

    const { result } = renderHook(
      () => useGetLiquidityHubs({ accountAddress: fakeAccountAddress }),
      {
        chainId: ChainId.ETHEREUM,
      },
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));

    expect(getLiquidityHubsSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it('does not fetch when the caller disables the query', async () => {
    const getLiquidityHubsSpy = vi.spyOn(getLiquidityHubsQueries, 'getLiquidityHubs');

    const { result } = renderHook(
      () => useGetLiquidityHubs({ accountAddress: fakeAccountAddress }, { enabled: false }),
      {
        chainId: ChainId.BSC_MAINNET,
      },
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));

    expect(getLiquidityHubsSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });
});
