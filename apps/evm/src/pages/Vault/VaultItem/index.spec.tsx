import BigNumber from 'bignumber.js';
import { en } from 'libs/translations';

import fakeAddress from '__mocks__/models/address';
import { vrt } from '__mocks__/models/tokens';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import VaultItem, { VaultItemProps } from '.';
import TEST_IDS from './testIds';

const fakeVault = fakeVaults[0];

const baseProps: VaultItemProps = {
  ...fakeVault,
  userStakedMantissa: new BigNumber('200000000000000000000'),
};

describe('pages/Vault/VaultItem', () => {
  it('renders without crashing', async () => {
    renderComponent(<VaultItem {...baseProps} />);
  });

  it('renders vault correctly', async () => {
    const { getByTestId, getAllByTestId } = renderComponent(<VaultItem {...baseProps} />);

    const symbolElement = getByTestId(TEST_IDS.symbol);
    const userStakedTokensElement = getByTestId(TEST_IDS.userStakedTokens);
    const dataListItemElements = getAllByTestId(TEST_IDS.dataListItem);

    expect(symbolElement.textContent).toMatchSnapshot();
    expect(userStakedTokensElement.textContent).toMatchSnapshot();

    dataListItemElements.map(dataListItemElement =>
      expect(dataListItemElement.textContent).toMatchSnapshot(),
    );
  });

  it('hides withdraw button if userStakedMantissa is equal to 0', async () => {
    const customBaseProps: VaultItemProps = {
      ...baseProps,
      stakedToken: vrt,
      userStakedMantissa: new BigNumber(0),
    };

    const { queryByText } = renderComponent(<VaultItem {...customBaseProps} />, {
      accountAddress: fakeAddress,
    });

    // Click on withdraw button
    expect(queryByText(en.vaultItem.withdrawButton)).toBeNull();
  });

  it('disables stake and withdraw buttons and displays message if isPaused is true', async () => {
    const customBaseProps: VaultItemProps = {
      ...baseProps,
      isPaused: true,
    };

    const { queryByText } = renderComponent(<VaultItem {...customBaseProps} />, {
      accountAddress: fakeAddress,
    });

    // Check stake and withdraw buttons are disabled
    expect(queryByText(en.vaultItem.stakeButton)?.closest('button')).toBeDisabled();
    expect(queryByText(en.vaultItem.withdrawButton)?.closest('button')).toBeDisabled();
    // Check warning is displayed
    expect(queryByText(en.vaultItem.pausedWarning));
  });
});
