import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { useGetPrimeToken } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';

import { Carousel } from '..';

describe('Carousel - Feature flag enabled: prime', () => {
  beforeEach(() => {
    (useGetPrimeToken as Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime',
    );
  });

  it('renders without crashing', () => {
    renderComponent(<Carousel />);
  });

  it('renders Prime promotional banner when user is not connected', () => {
    const { getByText } = renderComponent(<Carousel />);

    expect(getByText(en.dashboard.primePromotionalBanner.description));
  });

  it('renders Prime promotional banner when connected user is not Prime', () => {
    const { getByText } = renderComponent(<Carousel />, {
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

    renderComponent(<Carousel />, {
      accountAddress: fakeAccountAddress,
    });

    expect(
      screen.queryByText(en.dashboard.primePromotionalBanner.description),
    ).not.toBeInTheDocument();
  });
});
