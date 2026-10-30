import { QueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetPool } from 'clients/api/queries/useGetPool';
import FunctionKey from 'constants/functionKey';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { useGetLiquidityHubs } from '..';
import * as getLiquidityHubsQueries from '../..';

vi.mock('clients/api/queries/useGetPool', () => ({
  useGetPool: vi.fn(() => ({ data: undefined })),
}));

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

  it('does not fetch when the Liquidity Hub feature is disabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name !== 'liquidityHub',
    );

    const getLiquidityHubsSpy = vi.spyOn(getLiquidityHubsQueries, 'getLiquidityHubs');

    const { result } = renderHook(() =>
      useGetLiquidityHubs({ accountAddress: fakeAccountAddress }),
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));

    expect(getLiquidityHubsSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it('does not fetch when the caller enables the query but the feature is disabled', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name !== 'liquidityHub',
    );

    const getLiquidityHubsSpy = vi.spyOn(getLiquidityHubsQueries, 'getLiquidityHubs');

    const { result } = renderHook(() =>
      useGetLiquidityHubs({ accountAddress: fakeAccountAddress }, { enabled: true }),
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

  it('does not fetch the Core pool when the Liquidity Hub feature is disabled', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name !== 'liquidityHub',
    );

    renderHook(() => useGetLiquidityHubs({ accountAddress: fakeAccountAddress }));

    expect(useGetPool).toHaveBeenCalledWith(expect.anything(), { enabled: false });
  });

  it('does not fetch the Core pool when the caller disables the query', () => {
    (useIsFeatureEnabled as Mock).mockReturnValue(true);

    renderHook(() =>
      useGetLiquidityHubs({ accountAddress: fakeAccountAddress }, { enabled: false }),
    );

    expect(useGetPool).toHaveBeenCalledWith(expect.anything(), { enabled: false });
  });

  it('fetches the Core pool when auto-resupply and the Hub query are both enabled', () => {
    (useIsFeatureEnabled as Mock).mockReturnValue(true);
    vi.spyOn(getLiquidityHubsQueries, 'getLiquidityHubs').mockResolvedValue(fakeOutput);

    renderHook(() => useGetLiquidityHubs({ accountAddress: fakeAccountAddress }), {
      chainId: ChainId.BSC_MAINNET,
    });

    expect(useGetPool).toHaveBeenCalledWith(expect.anything(), { enabled: true });
  });
});
