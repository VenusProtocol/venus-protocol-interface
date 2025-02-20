import { fireEvent, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { en } from 'libs/translations';
import { useAuthModal, useSwitchChain } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { ConnectWallet } from '..';

describe('ConnectWallet', () => {
  beforeEach(() => {
    (useAuthModal as Mock).mockReturnValue({ openAuthModal: vi.fn() });
    (useSwitchChain as Mock).mockReturnValue({ switchChain: vi.fn() });
  });

  it('renders without crashing', () => {
    renderComponent(<ConnectWallet />);
  });

  it('displays authentication button when user is not connected', async () => {
    const { getByText } = renderComponent(<ConnectWallet />);
    const connectButton = getByText(en.connectWallet.connectButton);
    expect(connectButton).toBeInTheDocument();
  });

  it('calls openAuthModal when connect button is clicked', async () => {
    const mockOpenAuthModal = vi.fn();
    (useAuthModal as Mock).mockReturnValue({ openAuthModal: mockOpenAuthModal });

    const { getByText } = renderComponent(<ConnectWallet />);
    const connectButton = getByText(en.connectWallet.connectButton);

    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockOpenAuthModal).toHaveBeenCalledTimes(1);
    });
  });

  it('renders children when user is connected', () => {
    const { getByText } = renderComponent(
      <ConnectWallet>
        <div>Child Component</div>
      </ConnectWallet>,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(getByText('Child Component')).toBeInTheDocument();
  });

  it('displays the message prop when provided', () => {
    const message = 'Custom connect wallet message';
    const { getByText } = renderComponent(<ConnectWallet message={message} />);

    expect(getByText(message)).toBeInTheDocument();
  });
});
