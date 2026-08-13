import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { usePublicClients } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import { getHasIsolatedPoolPosition } from '..';
import { useGetChainIdsWithIsolatedPoolPosition } from '../useGetChainIdsWithIsolatedPoolPosition';

vi.mock('../index.ts');

const renderUseGetChainIdsWithIsolatedPoolPosition = () =>
  renderHook(() => useGetChainIdsWithIsolatedPoolPosition(), { accountAddress: fakeAddress });

describe('useGetChainIdsWithIsolatedPoolPosition', () => {
  beforeEach(() => {
    (usePublicClients as Mock).mockImplementation(({ chainIds }: { chainIds: ChainId[] }) => ({
      publicClients: chainIds.reduce((acc, chainId) => ({ ...acc, [chainId]: {} }), {}),
    }));
  });

  it('reports the chains the user has a position on', async () => {
    (getHasIsolatedPoolPosition as Mock).mockImplementation(() =>
      Promise.resolve({ hasPosition: true }),
    );

    const { result } = renderUseGetChainIdsWithIsolatedPoolPosition();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.chainIds.length).toBeGreaterThan(0);
  });

  it('reports the chains that resolved while another chain is still pending', async () => {
    let callCount = 0;

    (getHasIsolatedPoolPosition as Mock).mockImplementation(() => {
      callCount += 1;

      // Only the first chain ever resolves, all the others stay pending
      return callCount === 1 ? Promise.resolve({ hasPosition: true }) : new Promise(() => {});
    });

    const { result } = renderUseGetChainIdsWithIsolatedPoolPosition();

    await waitFor(() => expect(result.current.chainIds.length).toBe(1));
    expect(result.current.isLoading).toBe(false);
  });

  it('treats a chain that failed to resolve as having no position', async () => {
    (getHasIsolatedPoolPosition as Mock).mockImplementation(() =>
      Promise.reject(new Error('RPC unavailable')),
    );

    const { result } = renderUseGetChainIdsWithIsolatedPoolPosition();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.chainIds).toEqual([]);
  });

  it('does not query chains without a public client', async () => {
    (usePublicClients as Mock).mockImplementation(() => ({
      publicClients: { [ChainId.BSC_TESTNET]: {} },
    }));
    (getHasIsolatedPoolPosition as Mock).mockImplementation(() =>
      Promise.resolve({ hasPosition: true }),
    );

    const { result } = renderUseGetChainIdsWithIsolatedPoolPosition();

    await waitFor(() => expect(result.current.chainIds).toEqual([ChainId.BSC_TESTNET]));
    expect(getHasIsolatedPoolPosition).toHaveBeenCalledTimes(1);
  });
});
