import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress, { altAddress as fakeVTokenAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { xvs } from '__mocks__/models/tokens';
import { useGetSimulatedPool } from 'clients/api';
import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { BalanceMutation } from 'types';
import { useSimulateBalanceMutations } from '..';

vi.unmock('hooks/useSimulateBalanceMutations');

describe('useSimulateBalanceMutations', () => {
  it('calls the right hooks and returns the right data', async () => {
    (useGetToken as Mock).mockImplementation(() => xvs);

    (useGetUserPrimeInfo as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        isUserPrime: true,
        userStakedXvsTokens: new BigNumber('100'),
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
