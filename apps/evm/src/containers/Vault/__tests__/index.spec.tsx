import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';

import { Vault, type VaultProps } from '..';

const fakeVault = {
  ...fakeVaults[0],
  userStakedMantissa: new BigNumber('200000000000000000000'),
};

describe('pages/Vault/Vault', () => {
  it('renders without crashing', async () => {
    renderComponent(<Vault vault={fakeVault} />);
  });

  it('renders vault correctly', async () => {
    const { container } = renderComponent(<Vault vault={fakeVault} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('hides withdraw button if userStakedMantissa is equal to 0', async () => {
    const customFakeVault: VaultProps['vault'] = {
      ...fakeVault,
      userStakedMantissa: new BigNumber(0),
    };

    const { queryByText } = renderComponent(<Vault vault={customFakeVault} />, {
      accountAddress: fakeAddress,
    });

    // Click on withdraw button
    expect(queryByText(en.vault.withdrawButton)).toBeNull();
  });

  it('disables stake and withdraw buttons and displays message if isPaused is true', async () => {
    const customFakeVault: VaultProps['vault'] = {
      ...fakeVault,
      isPaused: true,
    };

    const { queryByText } = renderComponent(<Vault vault={customFakeVault} />, {
      accountAddress: fakeAddress,
    });

    // Check stake and withdraw buttons are disabled
    expect(queryByText(en.vault.stakeButton)?.closest('button')).toBeDisabled();
    expect(queryByText(en.vault.withdrawButton)?.closest('button')).toBeDisabled();
    // Check warning is displayed
    expect(queryByText(en.vault.pausedWarning));
  });
});
