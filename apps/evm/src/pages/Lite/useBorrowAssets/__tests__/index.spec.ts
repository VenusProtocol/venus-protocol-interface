import type { Mock } from 'vitest';

import { useGetSpokePools } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderHook } from 'testUtils/render';

import { useBorrowAssets } from '..';

describe('useBorrowAssets', () => {
  it('is ready without spoke data on chains where spoke is disabled', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(({ name }) => name !== 'spoke');
    (useGetSpokePools as Mock).mockReturnValue({ isLoading: false, data: undefined });

    const { result } = renderHook(() => useBorrowAssets());

    expect(result.current.isReady).toBe(true);
    expect(result.current.borrowAssets.length).toBeGreaterThan(0);
  });

  it('waits for spoke data on chains where spoke is enabled', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(({ name }) => name === 'spoke');
    (useGetSpokePools as Mock).mockReturnValue({ isLoading: true, data: undefined });

    const { result } = renderHook(() => useBorrowAssets());

    expect(result.current.isReady).toBe(false);
  });
});
