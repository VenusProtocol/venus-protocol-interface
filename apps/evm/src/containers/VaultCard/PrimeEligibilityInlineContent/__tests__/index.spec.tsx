import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { useGetToken } from 'libs/tokens';
import { renderComponent } from 'testUtils/render';

import { PrimeEligibilityInlineContent } from '..';

const mockUseGetUserPrimeInfo = useGetUserPrimeInfo as Mock;
const mockUseGetToken = useGetToken as Mock;

const makePrimeInfo = ({
  isUserPrime = false,
  userStakedXvsTokens = new BigNumber('100'),
  minXvsToStakeForPrimeTokens = new BigNumber('200'),
  claimWaitingPeriodSeconds = 5 * 24 * 60 * 60,
  userClaimTimeRemainingSeconds = 3 * 24 * 60 * 60,
}: {
  isUserPrime?: boolean;
  userStakedXvsTokens?: BigNumber;
  minXvsToStakeForPrimeTokens?: BigNumber;
  claimWaitingPeriodSeconds?: number;
  userClaimTimeRemainingSeconds?: number | undefined;
} = {}) => ({
  data: {
    isUserPrime,
    userStakedXvsTokens,
    minXvsToStakeForPrimeTokens,
    claimWaitingPeriodSeconds,
    userClaimTimeRemainingSeconds,
  },
});

describe('PrimeEligibilityInlineContent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-10T00:00:00.000Z'));

    mockUseGetToken.mockReturnValue(xvs);
    mockUseGetUserPrimeInfo.mockReturnValue(makePrimeInfo());
  });

  const renderPrimeEligibility = () =>
    renderComponent(<PrimeEligibilityInlineContent />, {
      accountAddress: fakeAccountAddress,
    });

  const openTooltip = async (container: HTMLElement) => {
    const tooltipTrigger = container.querySelector('svg');

    expect(tooltipTrigger).toBeInTheDocument();

    fireEvent.click(tooltipTrigger as SVGElement);

    await waitFor(() => expect(document.body.textContent).not.toBeNull());
  };

  it('returns nothing when the user is already Prime', () => {
    mockUseGetUserPrimeInfo.mockReturnValue(
      makePrimeInfo({
        isUserPrime: true,
      }),
    );

    const { container } = renderPrimeEligibility();

    expect(container.textContent).toMatchSnapshot();
  });

  it('returns nothing when the XVS token is unavailable', () => {
    mockUseGetToken.mockReturnValue(undefined);

    const { container } = renderPrimeEligibility();

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders progress and the stake-more-then-wait tooltip', async () => {
    const { container } = renderPrimeEligibility();

    expect(mockUseGetUserPrimeInfo).toHaveBeenCalledWith({
      accountAddress: fakeAccountAddress,
    });
    expect(container.textContent).toMatchSnapshot();

    await openTooltip(container);

    expect(document.body.textContent).toMatchSnapshot();
  });

  it('renders the wait-only tooltip when the user has enough XVS staked', async () => {
    mockUseGetUserPrimeInfo.mockReturnValue(
      makePrimeInfo({
        userStakedXvsTokens: new BigNumber('200'),
        minXvsToStakeForPrimeTokens: new BigNumber('200'),
      }),
    );

    const { container } = renderPrimeEligibility();

    expect(container.textContent).toMatchSnapshot();

    await openTooltip(container);

    expect(document.body.textContent).toMatchSnapshot();
  });

  it('renders the claim-ready tooltip when the user can already become Prime', async () => {
    mockUseGetUserPrimeInfo.mockReturnValue(
      makePrimeInfo({
        userStakedXvsTokens: new BigNumber('250'),
        minXvsToStakeForPrimeTokens: new BigNumber('200'),
        userClaimTimeRemainingSeconds: 0,
      }),
    );

    const { container } = renderPrimeEligibility();

    expect(container.textContent).toMatchSnapshot();

    await openTooltip(container);

    expect(document.body.textContent).toMatchSnapshot();
  });
});
