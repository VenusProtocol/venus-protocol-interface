import Vi from 'vitest';

import { useGetIsAddressPrime } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import PrimeStatusBanner from '..';
import TEST_IDS from '../testIds';

describe('PrimeStatusBanner', () => {
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
});
