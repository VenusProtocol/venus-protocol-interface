import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetIsUserPrimeV2, useGetPrimeToken } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderHook } from 'testUtils/render';

import { useIsUserPrime } from '..';

describe('useIsUserPrime', () => {
  beforeEach(() => {
    (useGetPrimeToken as Mock).mockReturnValue({
      data: {
        exists: false,
      },
      isLoading: false,
    });
    (useGetIsUserPrimeV2 as Mock).mockReturnValue({
      data: {
        isPrimeHolder: false,
      },
      isLoading: false,
    });
  });

  it('uses Prime V1 holder status when Prime V2 is disabled', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime',
    );
    (useGetPrimeToken as Mock).mockReturnValue({
      data: {
        exists: true,
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useIsUserPrime({ accountAddress: fakeAccountAddress }));

    expect(useGetPrimeToken).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
      },
      {
        enabled: true,
      },
    );
    expect(useGetIsUserPrimeV2).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
      },
      {
        enabled: false,
      },
    );
    expect(result.current).toEqual({
      isUserPrime: true,
      isLoading: false,
    });
  });

  it('uses Prime V2 holder status when Prime V2 is enabled', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime' || name === 'primeLeaderboard',
    );
    (useGetIsUserPrimeV2 as Mock).mockReturnValue({
      data: {
        isPrimeHolder: true,
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useIsUserPrime({ accountAddress: fakeAccountAddress }));

    expect(useGetPrimeToken).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
      },
      {
        enabled: false,
      },
    );
    expect(useGetIsUserPrimeV2).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
      },
      {
        enabled: true,
      },
    );
    expect(result.current).toEqual({
      isUserPrime: true,
      isLoading: false,
    });
  });
});
