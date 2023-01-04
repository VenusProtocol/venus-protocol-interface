import { fireEvent } from '@testing-library/react';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import ConnectWalletBanner, { ConnectWalletBannerUi } from '.';

jest.mock('clients/api');

describe('pages/Dashboard/ConnectWalletBanner', () => {
  it('renders without crashing', () => {
    renderComponent(<ConnectWalletBanner />);
  });

  it('renders nothing when a wallet is connected', () => {
    const { queryByText } = renderComponent(<ConnectWalletBanner />, {
      authContextValue: { account: { address: fakeAddress } },
    });

    expect(queryByText(en.dashboard.connectWalletBanner.title)).toBeNull();
  });

  it('prompt user to connect their wallet when pressing on connect button', () => {
    const openAuthModalMock = jest.fn();

    const { getByText } = renderComponent(
      <ConnectWalletBannerUi openAuthModal={openAuthModalMock} isWalletConnected={false} />,
    );

    const connectButton = getByText(en.dashboard.connectWalletBanner.buttonLabel);
    fireEvent.click(connectButton);

    expect(openAuthModalMock).toHaveBeenCalledTimes(1);
  });
});
