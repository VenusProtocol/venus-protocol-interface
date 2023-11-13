import { fireEvent } from '@testing-library/react';
import { en } from 'packages/translations';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetPrimeToken } from 'clients/api';
import { UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import renderComponent from 'testUtils/renderComponent';

import { Banner } from '..';
import TEST_IDS from '../PrimePromotionalBanner/testIds';
import { store } from '../store';

describe('Banner - Feature flag enabled: prime', () => {
  beforeEach(() => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));

    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );
  });

  it('renders without crashing', () => {
    renderComponent(<Banner />);
  });

  it('renders Prime promotional banner when user is not connected and has not closed it before', () => {
    const { getByText } = renderComponent(<Banner />);

    expect(getByText(en.dashboard.primePromotionalBanner.description));
  });

  it('renders Prime promotional banner when connected user is not Prime and has not closed it before', () => {
    const { getByText } = renderComponent(<Banner />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    expect(getByText(en.dashboard.primePromotionalBanner.description));
  });

  it('renders Connect Wallet banner when user is not Connected and has closed the Prime promotional banner before', () => {
    // Update store to simulate Prime promotional banner having been closed before
    store.setState({
      shouldShowBanner: false,
    });

    const { getByText } = renderComponent(<Banner />);

    expect(getByText(en.dashboard.connectWalletBanner.description));
  });

  it('renders nothing when connected user is Prime', () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: true,
        isIrrevocable: false,
      },
    }));

    const { baseElement } = renderComponent(<Banner />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    expect(baseElement.textContent).toEqual('');
  });

  it('lets user close the Prime promotional banner', () => {
    const { baseElement, getByTestId, getByRole } = renderComponent(<Banner />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    expect(getByTestId(TEST_IDS.closeButton));

    // Click on close button
    fireEvent.click(getByRole('button'));

    expect(baseElement.textContent).toEqual('');
  });
});
