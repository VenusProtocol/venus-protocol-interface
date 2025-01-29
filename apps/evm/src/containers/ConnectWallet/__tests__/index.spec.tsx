import { fireEvent, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { en } from 'libs/translations';
import { useAuthModal, useSwitchChain } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
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

  it('displays chain switching button when current chain is different from chainId parameter', async () => {
    const { getByText } = renderComponent(<ConnectWallet chainId={ChainId.OPBNB_TESTNET} />, {
      accountAddress: fakeAccountAddress,
    });

    const switchChainButton = getByText(
      en.connectWallet.switchChain.replace('{{chainName}}', 'opBNB testnet'),
    );
    expect(switchChainButton).toBeInTheDocument();
  });

  it('calls switchChain when switch chain button is clicked', async () => {
    const mockSwitchChain = vi.fn();
    (useSwitchChain as Mock).mockReturnValue({ switchChain: mockSwitchChain });

    const { getByText } = renderComponent(<ConnectWallet chainId={ChainId.OPBNB_TESTNET} />, {
      accountAddress: fakeAccountAddress,
    });

    const switchChainButton = getByText(
      en.connectWallet.switchChain.replace('{{chainName}}', 'opBNB testnet'),
    );

    fireEvent.click(switchChainButton);

    await waitFor(() => {
      expect(mockSwitchChain).toHaveBeenCalledTimes(1);
      expect(mockSwitchChain).toHaveBeenCalledWith({ chainId: ChainId.OPBNB_TESTNET });
    });
  });

  it('renders children when user is connected and on the correct chain', () => {
    const { getByText } = renderComponent(
      <ConnectWallet chainId={ChainId.BSC_TESTNET}>
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
