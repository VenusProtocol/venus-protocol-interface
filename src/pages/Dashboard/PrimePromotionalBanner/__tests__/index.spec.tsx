import { fireEvent, screen } from '@testing-library/react';
import Vi from 'vitest';

import { useGetPrimeToken } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import { PrimePromotionalBanner } from '..';
import TEST_IDS from '../testIds';

describe('PrimePromotionalBanner', () => {
  it('renders when user is not prime', async () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: false,
      },
    }));

    renderComponent(<PrimePromotionalBanner />);

    await screen.findByText(en.dashboard.primePromotionalBanner.description);
  });

  it('renders nothing when user is prime', () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: true,
      },
    }));

    renderComponent(<PrimePromotionalBanner />);

    expect(
      screen.queryByText(en.dashboard.primePromotionalBanner.description),
    ).not.toBeInTheDocument();
  });

  it('closes banner when clicking on close icon', async () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: false,
      },
    }));

    renderComponent(<PrimePromotionalBanner />);

    await screen.findByText(en.dashboard.primePromotionalBanner.description);

    // Click on close button
    fireEvent.click(screen.getByTestId(TEST_IDS.closeButton));

    expect(
      screen.queryByText(en.dashboard.primePromotionalBanner.description),
    ).not.toBeInTheDocument();
  });
});
