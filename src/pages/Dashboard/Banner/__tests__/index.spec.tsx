import { fireEvent } from '@testing-library/react';
import { en } from 'packages/translations';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetPrimeToken } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import { renderComponent } from 'testUtils/render';

import { Banner } from '..';

vi.mock('context/AuthContext');

describe('Banner', () => {
  beforeEach(() => {
    (useAuth as Vi.Mock).mockImplementation(() => ({
      accountAddress: undefined,
      openAuthModal: vi.fn(),
    }));

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
    (useAuth as Vi.Mock).mockImplementation(() => ({
      accountAddress: fakeAccountAddress,
    }));

    const { baseElement } = renderComponent(<Banner />);

    expect(baseElement.textContent).toEqual('');
  });

  it('opens auth modal when clicking on button', () => {
    const openAuthModalMock = vi.fn();

    (useAuth as Vi.Mock).mockImplementation(() => ({
      accountAddress: undefined,
      openAuthModal: openAuthModalMock,
    }));

    const { getByText } = renderComponent(<Banner />);

    // Click on button
    fireEvent.click(getByText(en.dashboard.connectWalletBanner.buttonLabel));

    expect(openAuthModalMock).toHaveBeenCalledTimes(1);
  });
});
