import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress, { altAddress as fakeVTokenAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPrimeVaultConfig, useGetSimulatedPool, useGetXvsVaultUserInfo } from 'clients/api';
import { useIsUserPrime } from 'hooks/useIsUserPrime';
import { renderHook } from 'testUtils/render';
import type { BalanceMutation } from 'types';
import { useSimulateBalanceMutations } from '..';

vi.unmock('hooks/useSimulateBalanceMutations');
vi.mock('hooks/useIsUserPrime');

describe('useSimulateBalanceMutations', () => {
  it('calls the right hooks and returns the right data', async () => {
    (useIsUserPrime as Mock).mockImplementation(() => ({
      isUserPrime: true,
      isLoading: false,
    }));

    (useGetPrimeVaultConfig as Mock).mockImplementation(() => ({
      data: {
        poolIndex: 1,
        rewardTokenAddress: fakeVTokenAddress,
      },
      isLoading: false,
    }));

    (useGetXvsVaultUserInfo as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        stakedAmountMantissa: new BigNumber('110000000000000000000'),
        pendingWithdrawalsTotalAmountMantissa: new BigNumber('10000000000000000000'),
      },
    }));

    (useGetSimulatedPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolData[0],
      },
    }));

    const fakeBalanceMutations: BalanceMutation[] = [
      {
        type: 'asset',
        vTokenAddress: fakeVTokenAddress,
        amountTokens: new BigNumber(1000),
        action: 'supply',
      },
    ];

    const { result } = renderHook(
      () =>
        useSimulateBalanceMutations({
          balanceMutations: fakeBalanceMutations,
          pool: poolData[0],
        }),
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect((useGetSimulatedPool as Mock).mock.calls[0][0]).toEqual({
      pool: poolData[0],
      balanceMutations: fakeBalanceMutations,
      accountAddress: fakeAccountAddress,
      isUserPrime: true,
      userXvsStakedMantissa: new BigNumber('100000000000000000000'),
    });

    expect(result.current.data).toMatchSnapshot();
  });
});
