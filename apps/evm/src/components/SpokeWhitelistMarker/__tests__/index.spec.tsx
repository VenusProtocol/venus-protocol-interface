import { fireEvent, screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';

import { SpokeWhitelistMarker } from '..';

const comptrollerAddress = '0xA73D31939c936d07fA0FD15b3d86C0fe2a72c282';
const userWhitelistedText = 'You’re eligible to borrow from this pool.';

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const openTooltip = async () => {
  fireEvent.pointerMove(screen.getByRole('button', { name: 'Whitelist' }));

  return screen.findAllByText('Only whitelisted addresses can supply and borrow from this pool.');
};

describe('SpokeWhitelistMarker', () => {
  it('renders the default state when the wallet is not whitelisted', () => {
    renderComponent(
      <SpokeWhitelistMarker
        level="asset"
        comptrollerAddress={comptrollerAddress}
        isUserWhitelisted={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Whitelist' })).toBeInTheDocument();
  });

  it('does not show the eligibility message when the wallet is not whitelisted', async () => {
    renderComponent(
      <SpokeWhitelistMarker
        level="pool"
        comptrollerAddress={comptrollerAddress}
        isUserWhitelisted={false}
      />,
    );

    await openTooltip();

    expect(screen.queryByText(userWhitelistedText)).not.toBeInTheDocument();
  });

  it('shows the eligibility message when the wallet is whitelisted', async () => {
    renderComponent(
      <SpokeWhitelistMarker
        level="pool"
        comptrollerAddress={comptrollerAddress}
        isUserWhitelisted
      />,
    );

    await openTooltip();

    expect((await screen.findAllByText(userWhitelistedText))[0]).toBeInTheDocument();
  });

  it('links to the comptroller on the explorer of the current chain', async () => {
    renderComponent(
      <SpokeWhitelistMarker
        level="pool"
        comptrollerAddress={comptrollerAddress}
        isUserWhitelisted={false}
      />,
      { chainId: ChainId.BSC_TESTNET },
    );

    await openTooltip();

    expect(screen.getAllByRole('link', { name: 'View whitelist on-chain' })[0]).toHaveAttribute(
      'href',
      `https://testnet.bscscan.com/address/${comptrollerAddress}#readProxyContract`,
    );
  });
});
