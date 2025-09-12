import { screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetUserVaiBorrowBalance, useGetVaiRepayApr } from 'clients/api';
import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { Account } from '..';

vi.mock('hooks/useGetUserPrimeInfo');

const fakeUserPrimeInfo = {
  isUserPrime: false,
  primeTokenLimit: 1,
  claimedPrimeTokenCount: 0,
  userStakedXvsTokens: new BigNumber(100),
  minXvsToStakeForPrimeTokens: new BigNumber(1),
  userHighestPrimeSimulationApyBoostPercentage: new BigNumber(1),
  userClaimTimeRemainingSeconds: 1,
};

describe('Account - Feature flag enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime',
    );

    (useGetUserVaiBorrowBalance as Mock).mockImplementation(() => ({
      data: {
        userVaiBorrowBalanceMantissa: new BigNumber('1000000000000000000000'),
      },
      isLoading: false,
    }));

    (useGetVaiRepayApr as Mock).mockImplementation(() => ({
      data: {
        repayAprPercentage: new BigNumber(5.34),
      },
      isLoading: false,
    }));
  });

  it('displays Prime banner if user is not Prime and Prime feature is enabled', async () => {
    (useGetUserPrimeInfo as Mock).mockImplementation(() => ({
      isLoading: false,
      data: fakeUserPrimeInfo,
    }));

    renderComponent(<Account />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(screen.queryAllByText(en.account.primeBanner.button.stakeXvs).length).toBeGreaterThan(
        0,
      ),
    );
  });

  it('displays Prime banner if user can become Prime and Prime feature is enabled', async () => {
    (useGetUserPrimeInfo as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        ...fakeUserPrimeInfo,
        userClaimTimeRemainingSeconds: 0,
      },
    }));

    renderComponent(<Account />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(
        screen.queryAllByText(en.account.primeBanner.button.becomePrime).length,
      ).toBeGreaterThan(0),
    );
  });
});
