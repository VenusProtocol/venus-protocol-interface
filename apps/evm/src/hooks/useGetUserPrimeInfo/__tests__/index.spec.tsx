import { waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import {
  useGetPools,
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultUserInfo,
} from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetUserPrimeInfo } from '..';

const MOCK_DEFAULT_PRIME_STATUS = {
  claimWaitingPeriodSeconds: 600,
  userClaimTimeRemainingSeconds: 600,
  claimedPrimeTokenCount: 0,
  primeMarkets: [],
  primeTokenLimit: 1000,
  primeMinimumStakedXvsMantissa: new BigNumber('10000000000000000000'),
  xvsVault: '',
  xvsVaultPoolId: 1,
  rewardTokenAddress: '',
};

describe('useGetUserPrimeInfo', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime',
    );

    (useGetPools as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pools: poolData,
      },
    }));

    (useGetPrimeStatus as Mock).mockImplementation(() => ({
      isLoading: false,
      data: MOCK_DEFAULT_PRIME_STATUS,
    }));

    (useGetXvsVaultUserInfo as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        stakedAmountMantissa: new BigNumber('100000000000000000000'),
        pendingWithdrawalsTotalAmountMantissa: new BigNumber('10000000000000000000'),
      },
    }));

    (useGetPrimeToken as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        exists: false,
      },
    }));
  });

  it('returns data in the correct format', async () => {
    const { isLoading, data } = useGetUserPrimeInfo({
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(isLoading).toBe(false));

    expect(data).toMatchSnapshot();
  });
});
