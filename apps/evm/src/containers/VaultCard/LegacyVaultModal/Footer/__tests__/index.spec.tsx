import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { vaults } from '__mocks__/models/vaults';
import { useClaimPrimeToken, useGetPrimeStatus } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import PRIME_STATUS_BANNER_TEST_IDS from 'containers/PrimeStatusBanner/testIds';
import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNow } from 'hooks/useNow';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { formatTokensToReadableValue } from 'utilities';
import { Footer, type FooterProps } from '..';
import { calculateDailyVaultEarnings } from '../calculateDailyVaultEarnings';

vi.mock('hooks/useNow');

const baseVault = {
  ...vaults[1],
  poolIndex: 7,
};

const baseProps: FooterProps = {
  action: 'stake',
  vault: baseVault,
  fromAmountTokens: new BigNumber(0),
};

const getReadableDailyEarnings = (balance: BigNumber) =>
  formatTokensToReadableValue({
    value: calculateDailyVaultEarnings({
      balance,
      vault: baseVault,
    }),
    token: baseVault.rewardToken,
  });

describe('LegacyVaultModal/Footer', () => {
  const mockUseAccountAddress = useAccountAddress as Mock;
  const mockUseClaimPrimeToken = useClaimPrimeToken as Mock;
  const mockUseGetPrimeStatus = useGetPrimeStatus as Mock;
  const mockUseGetToken = useGetToken as Mock;
  const mockUseGetUserPrimeInfo = useGetUserPrimeInfo as Mock;
  const mockUseIsFeatureEnabled = useIsFeatureEnabled as Mock;
  const mockUseNow = useNow as Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-10T00:00:00.000Z'));

    mockUseAccountAddress.mockReturnValue({
      accountAddress: undefined,
    });

    mockUseNow.mockReturnValue(new Date('2024-01-10T00:00:00.000Z'));
    mockUseIsFeatureEnabled.mockReturnValue(false);
    mockUseGetPrimeStatus.mockReturnValue({
      data: undefined,
    });
    mockUseGetToken.mockReturnValue(xvs);
    mockUseGetUserPrimeInfo.mockReturnValue({
      data: {
        isUserPrime: false,
        claimedPrimeTokenCount: 0,
        primeTokenLimit: 1000,
        claimWaitingPeriodSeconds: 10000,
        userClaimTimeRemainingSeconds: 600,
        userStakedXvsTokens: new BigNumber(0),
        minXvsToStakeForPrimeTokens: new BigNumber(10),
        userHighestPrimeSimulationApyBoostPercentage: new BigNumber(10),
      },
      isLoading: false,
    });
    mockUseClaimPrimeToken.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('renders only the APR row when the wallet is disconnected', () => {
    const { getByText, queryByText, queryByTestId } = renderComponent(<Footer {...baseProps} />);

    expect(mockUseGetPrimeStatus).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
      },
      {
        enabled: false,
      },
    );

    expect(getByText('APR')).toBeInTheDocument();
    expect(getByText('12.92%')).toBeInTheDocument();
    expect(queryByText('Currently deposited')).not.toBeInTheDocument();
    expect(queryByText('Est. daily earnings')).not.toBeInTheDocument();
    expect(queryByText('Locking period')).not.toBeInTheDocument();
    expect(
      queryByTestId(PRIME_STATUS_BANNER_TEST_IDS.primeStatusBannerContainer),
    ).not.toBeInTheDocument();
  });

  it('renders projected stake values and the locking period for a connected Venus vault', () => {
    const { getByText } = renderComponent(
      <Footer {...baseProps} fromAmountTokens={new BigNumber(10)} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const currentlyStakedRow = getByText('Currently deposited').parentElement?.parentElement;
    const estimatedDailyEarningsRow = getByText('Est. daily earnings').parentElement?.parentElement;

    expect(currentlyStakedRow).toHaveTextContent('233 XVS');
    expect(currentlyStakedRow).toHaveTextContent('243 XVS');
    expect(estimatedDailyEarningsRow).toHaveTextContent(
      getReadableDailyEarnings(new BigNumber(233)),
    );
    expect(estimatedDailyEarningsRow).toHaveTextContent(
      getReadableDailyEarnings(new BigNumber(243)),
    );
    expect(getByText('Locking period')).toBeInTheDocument();
    expect(getByText('5 minutes')).toBeInTheDocument();
    expect(getByText('APR')).toBeInTheDocument();
  });

  it('subtracts the entered amount from the projected staked balance on withdraw', () => {
    const { getByText } = renderComponent(
      <Footer {...baseProps} action="withdraw" fromAmountTokens={new BigNumber(10)} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const currentlyStakedRow = getByText('Currently deposited').parentElement?.parentElement;
    const estimatedDailyEarningsRow = getByText('Est. daily earnings').parentElement?.parentElement;

    expect(currentlyStakedRow).toHaveTextContent('233 XVS');
    expect(currentlyStakedRow).toHaveTextContent('223 XVS');
    expect(estimatedDailyEarningsRow).toHaveTextContent(
      getReadableDailyEarnings(new BigNumber(233)),
    );
    expect(estimatedDailyEarningsRow).toHaveTextContent(
      getReadableDailyEarnings(new BigNumber(223)),
    );
  });

  it('omits projected updates when the entered amount is zero', () => {
    const { getByText, queryByText } = renderComponent(<Footer {...baseProps} />, {
      accountAddress: fakeAccountAddress,
    });

    const currentlyStakedRow = getByText('Currently deposited').parentElement?.parentElement;
    const estimatedDailyEarningsRow = getByText('Est. daily earnings').parentElement?.parentElement;

    expect(currentlyStakedRow).toHaveTextContent('233 XVS');
    expect(estimatedDailyEarningsRow).toHaveTextContent(
      getReadableDailyEarnings(new BigNumber(233)),
    );
    expect(queryByText('243 XVS')).not.toBeInTheDocument();
    expect(queryByText(getReadableDailyEarnings(new BigNumber(243)))).not.toBeInTheDocument();
  });

  it('renders the prime status banner only when the vault pool matches the prime pool', () => {
    mockUseIsFeatureEnabled.mockReturnValue(true);
    mockUseGetPrimeStatus.mockReturnValue({
      data: {
        xvsVaultPoolId: baseVault.poolIndex,
      },
    });

    const { getByTestId, queryByTestId, rerender } = renderComponent(<Footer {...baseProps} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(
      getByTestId(PRIME_STATUS_BANNER_TEST_IDS.primeStatusBannerContainer),
    ).toBeInTheDocument();

    rerender(
      <Footer
        {...baseProps}
        vault={{
          ...baseVault,
          poolIndex: baseVault.poolIndex + 1,
        }}
      />,
    );

    expect(
      queryByTestId(PRIME_STATUS_BANNER_TEST_IDS.primeStatusBannerContainer),
    ).not.toBeInTheDocument();
  });
});
