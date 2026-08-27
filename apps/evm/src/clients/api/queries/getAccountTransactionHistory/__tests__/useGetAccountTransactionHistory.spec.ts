import { waitFor } from '@testing-library/react';
import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPools } from 'clients/api/queries/useGetPools';
import { renderHook } from 'testUtils/render';
import { type Mock, vi } from 'vitest';
import * as getAccountTransactionHistoryQueries from '..';
import { useGetAccountTransactionHistory } from '../useGetAccountTransactionHistory';

vi.mock('clients/api/queries/useGetPools', () => ({
  useGetPools: vi.fn(),
}));

const fakeOutput = {
  count: 0,
  transactions: [],
};

const mockGetAccountTransactionHistory = () =>
  vi
    .spyOn(getAccountTransactionHistoryQueries, 'getAccountTransactionHistory')
    .mockResolvedValue(fakeOutput);

describe('useGetAccountTransactionHistory', () => {
  it('does not fetch the transactions while the pools are loading', async () => {
    const getAccountTransactionHistorySpy = mockGetAccountTransactionHistory();

    (useGetPools as Mock).mockReturnValue({
      data: undefined,
      isError: false,
    });

    const { result } = renderHook(() =>
      useGetAccountTransactionHistory({ accountAddress: fakeAddress }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    expect(getAccountTransactionHistorySpy).not.toHaveBeenCalled();
  });

  it('fetches the transactions with the pools once they have resolved', async () => {
    const getAccountTransactionHistorySpy = mockGetAccountTransactionHistory();

    (useGetPools as Mock).mockReturnValue({
      data: { pools: poolData },
      isError: false,
    });

    const { result } = renderHook(() =>
      useGetAccountTransactionHistory({ accountAddress: fakeAddress }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAccountTransactionHistorySpy).toHaveBeenCalledTimes(1);
    expect(getAccountTransactionHistorySpy).toHaveBeenCalledWith(
      expect.objectContaining({ getPoolsData: { pools: poolData } }),
    );
  });

  it('fetches the transactions once the pools resolve after an initial render without them', async () => {
    const getAccountTransactionHistorySpy = mockGetAccountTransactionHistory();

    // Simulate the pools not having been fetched yet on first render
    (useGetPools as Mock).mockReturnValue({
      data: undefined,
      isError: false,
    });

    const { result, rerender } = renderHook(() =>
      useGetAccountTransactionHistory({ accountAddress: fakeAddress }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(true));
    expect(getAccountTransactionHistorySpy).not.toHaveBeenCalled();

    (useGetPools as Mock).mockReturnValue({
      data: { pools: poolData },
      isError: false,
    });

    rerender();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAccountTransactionHistorySpy).toHaveBeenCalledTimes(1);
    expect(getAccountTransactionHistorySpy).toHaveBeenCalledWith(
      expect.objectContaining({ getPoolsData: { pools: poolData } }),
    );
  });

  it('refetches the transactions when the assets of the pools change', async () => {
    const getAccountTransactionHistorySpy = mockGetAccountTransactionHistory();

    (useGetPools as Mock).mockReturnValue({
      data: { pools: [poolData[0]] },
      isError: false,
    });

    const { result, rerender } = renderHook(() =>
      useGetAccountTransactionHistory({ accountAddress: fakeAddress }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAccountTransactionHistorySpy).toHaveBeenCalledTimes(1);

    (useGetPools as Mock).mockReturnValue({
      data: { pools: poolData },
      isError: false,
    });

    rerender();

    await waitFor(() => expect(getAccountTransactionHistorySpy).toHaveBeenCalledTimes(2));
  });

  it('does not refetch the transactions when the assets are returned in a different order', async () => {
    const getAccountTransactionHistorySpy = mockGetAccountTransactionHistory();

    (useGetPools as Mock).mockReturnValue({
      data: { pools: poolData },
      isError: false,
    });

    const { result, rerender } = renderHook(() =>
      useGetAccountTransactionHistory({ accountAddress: fakeAddress }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    (useGetPools as Mock).mockReturnValue({
      data: { pools: poolData.map(pool => ({ ...pool, assets: [...pool.assets].reverse() })) },
      isError: false,
    });

    rerender();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAccountTransactionHistorySpy).toHaveBeenCalledTimes(1);
  });

  it('does not fetch the transactions when the pools could not be fetched', async () => {
    const getAccountTransactionHistorySpy = mockGetAccountTransactionHistory();

    (useGetPools as Mock).mockReturnValue({
      data: undefined,
      isError: true,
    });

    const { result } = renderHook(() =>
      useGetAccountTransactionHistory({ accountAddress: fakeAddress }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getAccountTransactionHistorySpy).not.toHaveBeenCalled();
  });

  it('does not report a loading state when the query is disabled', async () => {
    const getAccountTransactionHistorySpy = mockGetAccountTransactionHistory();

    (useGetPools as Mock).mockReturnValue({
      data: undefined,
      isError: false,
    });

    const { result } = renderHook(() =>
      useGetAccountTransactionHistory({ accountAddress: fakeAddress }, { enabled: false }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getAccountTransactionHistorySpy).not.toHaveBeenCalled();
  });
});
