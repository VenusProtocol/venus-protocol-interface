import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';

import { VaultCard as Vault, type VaultProps } from '..';
import TEST_IDS from '../testIds';

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

  it('disables stake button and displays message if isPaused is true', async () => {
    const customFakeVault: VaultProps['vault'] = {
      ...fakeVault,
      userStakedMantissa: new BigNumber('0'),
      isPaused: true,
    };

    const { getByTestId, queryByText } = renderComponent(<Vault vault={customFakeVault} />, {
      accountAddress: fakeAddress,
    });

    // Check card is styled as non-interactive when paused
    expect(getByTestId(TEST_IDS.userStakedTokens)).toHaveClass('cursor-not-allowed');

    // Check warning is displayed
    expect(queryByText(en.vault.card.pausedWarning)).toBeInTheDocument();
  });
});
