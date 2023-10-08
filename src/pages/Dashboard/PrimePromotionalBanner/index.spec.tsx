import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import { PrimePromotionalBanner } from '.';

describe('PrimePromotionalBanner', () => {
  it('renders when user is not prime', () => {
    const { queryByText } = renderComponent(<PrimePromotionalBanner />, {
      authContextValue: {
        isPrime: false,
      },
    });

    expect(queryByText(en.dashboard.primePromotionalBanner.description)).toBeInTheDocument();
  });

  it('renders nothing when user is prime', () => {
    const { queryByText } = renderComponent(<PrimePromotionalBanner />, {
      authContextValue: {
        isPrime: true,
      },
    });

    expect(queryByText(en.dashboard.primePromotionalBanner.description)).toBeNull();
  });
});
