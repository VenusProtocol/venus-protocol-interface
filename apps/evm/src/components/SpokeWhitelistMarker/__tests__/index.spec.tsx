import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { SpokeWhitelistMarker } from '..';

const comptrollerAddress = '0xA73D31939c936d07fA0FD15b3d86C0fe2a72c282';

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

  it('renders the whitelisted state when the wallet is whitelisted', () => {
    renderComponent(
      <SpokeWhitelistMarker
        level="pool"
        comptrollerAddress={comptrollerAddress}
        isUserWhitelisted
      />,
    );

    expect(screen.getByRole('button', { name: 'Whitelist' })).toBeInTheDocument();
  });
});
