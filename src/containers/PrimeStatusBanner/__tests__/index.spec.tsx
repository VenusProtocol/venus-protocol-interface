import { waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import { useGetIsAddressPrime, useGetPrimeStatus, useGetXvsVaultUserInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import PrimeStatusBanner from '..';
import TEST_IDS from '../testIds';

vi.useFakeTimers();

describe('PrimeStatusBanner', () => {
  const MOCK_DEFAULT_PRIME_STATUS = {
    claimWaitingPeriodSeconds: 600,
    userClaimTimeRemainingSeconds: 600,
    claimedPrimeTokenCount: 0,
    primeMarkets: [],
    primeTokenLimit: 1000,
    primeMinimumStakedXvsMantissa: new BigNumber('1000000'),
    xvsVault: '',
    xvsVaultPoolId: 1,
    rewardTokenAddress: '',
  };

  beforeEach(() => {
    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        ...MOCK_DEFAULT_PRIME_STATUS,
      },
    }));
    (useGetXvsVaultUserInfo as Vi.Mock).mockImplementation(() => ({
      data: {
        stakedAmountWei: new BigNumber('0'),
        pendingWithdrawalsTotalAmountWei: new BigNumber('0'),
      },
    }));
    (useGetIsAddressPrime as Vi.Mock).mockImplementation(() => ({
      data: {
        isPrime: false,
      },
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComponent(<PrimeStatusBanner />);
  });

  it('renders nothing if user is Prime', () => {
    (useGetIsAddressPrime as Vi.Mock).mockImplementation(() => ({
      data: {
        isPrime: true,
      },
    }));

    const { queryByTestId } = renderComponent(<PrimeStatusBanner />);

    expect(queryByTestId(TEST_IDS.primeStatusBannerContainer)).toBeNull();
  });

  it('informs the user the requirements to be a Prime user', async () => {
    const { queryByTestId } = renderComponent(<PrimeStatusBanner />);
    await waitFor(() => queryByTestId(TEST_IDS.stakeXvsButton));

    expect(queryByTestId(TEST_IDS.stakeXvsButton)).toBeVisible();
    expect(queryByTestId(TEST_IDS.stakeXvsButton)).toBeEnabled();
    expect(queryByTestId(TEST_IDS.primeStatusBannerContainer)).toBeVisible();
  });

  it('displays a warning when there are less than 5% of Prime tokens left', async () => {
    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        ...MOCK_DEFAULT_PRIME_STATUS,
        claimedPrimeTokenCount: 999,
      },
    }));

    const { queryByTestId } = renderComponent(<PrimeStatusBanner />);
    await waitFor(() => queryByTestId(TEST_IDS.primeTokensLeftWarning));

    expect(queryByTestId(TEST_IDS.primeTokensLeftWarning)).toBeVisible();
  });

  it('displays the time remaining to be a Prime user, when a user has staked enough XVS', async () => {
    const text = '10 minutes until you can become a Prime user';
    (useGetXvsVaultUserInfo as Vi.Mock).mockImplementation(() => ({
      data: {
        stakedAmountWei: new BigNumber('1000000'),
        pendingWithdrawalsTotalAmountWei: new BigNumber('0'),
      },
    }));
    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        ...MOCK_DEFAULT_PRIME_STATUS,
        claimWaitingPeriodSeconds: 600,
        userClaimTimeRemainingSeconds: 600,
      },
    }));

    const { queryByTestId, queryByText } = renderComponent(<PrimeStatusBanner />);
    await waitFor(() => queryByText(text));

    expect(queryByTestId(TEST_IDS.claimPrimeTokenButton)).toBeNull();
    expect(queryByText(text)).toBeVisible();
  });

  it('allows the user to claim a Prime token if all the criteria match', async () => {
    (useGetXvsVaultUserInfo as Vi.Mock).mockImplementation(() => ({
      data: {
        stakedAmountWei: new BigNumber('1000000'),
        pendingWithdrawalsTotalAmountWei: new BigNumber('0'),
      },
    }));
    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        ...MOCK_DEFAULT_PRIME_STATUS,
        userClaimTimeRemainingSeconds: 0,
      },
    }));

    const { queryByTestId } = renderComponent(<PrimeStatusBanner />);
    await waitFor(() => queryByTestId(TEST_IDS.claimPrimeTokenButton));

    expect(queryByTestId(TEST_IDS.claimPrimeTokenButton)).toBeVisible();
    expect(queryByTestId(TEST_IDS.claimPrimeTokenButton)).toBeEnabled();
  });
});
