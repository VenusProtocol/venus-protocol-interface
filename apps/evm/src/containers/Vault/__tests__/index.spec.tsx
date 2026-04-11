import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';

import { LegacyVaultModal as Vault, type VaultProps } from '../VaultModals/LegacyModal';

const fakeVault = {
  ...fakeVaults[0],
  userStakedMantissa: new BigNumber('200000000000000000000'),
};

describe('pages/Vault/Vault', () => {
  it('renders without crashing', async () => {
    renderComponent(<Vault vault={fakeVault} isOpen handleClose={vi.fn()} />);
  });

  it('renders vault correctly', async () => {
    const { container } = renderComponent(<Vault vault={fakeVault} isOpen handleClose={vi.fn()} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('disables stake button and displays message if isPaused is true', async () => {
    const customFakeVault: VaultProps['vault'] = {
      ...fakeVault,
      userStakedMantissa: new BigNumber('0'),
      isPaused: true,
    };

    const { queryByText } = renderComponent(
      <Vault vault={customFakeVault} isOpen handleClose={vi.fn()} />,
      {
        accountAddress: fakeAddress,
      },
    );

    // Check warning is displayed
    expect(queryByText(en.vault.card.pausedWarning)).toBeInTheDocument();
  });
});
