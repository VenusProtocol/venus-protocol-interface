import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { useGetPrimeToken } from 'clients/api';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';

import { Banner } from '..';

describe('Banner - Feature flag enabled: prime', () => {
  beforeEach(() => {
    (useGetPrimeToken as Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );
  });

  it('renders without crashing', () => {
    renderComponent(<Banner />);
  });

  it('renders Prime promotional banner when user is not connected', () => {
    const { getByText } = renderComponent(<Banner />);

    expect(getByText(en.dashboard.primePromotionalBanner.description));
  });

  it('renders Prime promotional banner when connected user is not Prime', () => {
    const { getByText } = renderComponent(<Banner />, {
      accountAddress: fakeAccountAddress,
    });

    expect(getByText(en.dashboard.primePromotionalBanner.description));
  });

  it('does not render Prime promotional banner when user is Prime', () => {
    (useGetPrimeToken as Mock).mockImplementation(() => ({
      data: {
        exists: true,
        isIrrevocable: false,
      },
    }));

    renderComponent(<Banner />, {
      accountAddress: fakeAccountAddress,
    });

    expect(
      screen.queryByText(en.dashboard.primePromotionalBanner.description),
    ).not.toBeInTheDocument();
  });
});
