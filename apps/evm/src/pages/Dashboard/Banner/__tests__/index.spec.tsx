import { fireEvent } from '@testing-library/react';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { useGetPrimeToken } from 'clients/api';
import { useAuthModal } from 'hooks/useAuthModal';
import { en } from 'libs/translations';

import { Banner } from '..';

vi.mock('hooks/useAuthModal');

describe('Banner', () => {
  beforeEach(() => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: false,
        isIrrevocable: false,
      },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Banner />);
  });

  it('displays Connect Wallet banner when user is not connected', () => {
    const { getByText } = renderComponent(<Banner />);

    expect(getByText(en.dashboard.connectWalletBanner.description));
  });

  it('displays nothing when user is connected', () => {
    const { baseElement } = renderComponent(<Banner />, {
      accountAddress: fakeAccountAddress,
    });

    expect(baseElement.textContent).toEqual('');
  });

  it('opens auth modal when clicking on button', () => {
    const openAuthModalMock = vi.fn();

    (useAuthModal as Vi.Mock).mockImplementation(() => ({
      isAuthModalOpen: false,
      openAuthModal: openAuthModalMock,
    }));

    const { getByText } = renderComponent(<Banner />);

    // Click on button
    fireEvent.click(getByText(en.dashboard.connectWalletBanner.buttonLabel));

    expect(openAuthModalMock).toHaveBeenCalledTimes(1);
  });
});
