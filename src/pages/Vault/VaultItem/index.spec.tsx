import BigNumber from 'bignumber.js';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import VaultItem, { VaultItemProps } from '.';
import TEST_IDS from './testIds';

vi.mock('hooks/useSuccessfulTransactionModal');

const fakeVault = fakeVaults[0];

const baseProps: VaultItemProps = {
  ...fakeVault,
  userStakedWei: new BigNumber('200000000000000000000'),
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

  it('hides withdraw button userStakedWei is equal to 0', async () => {
    const customBaseProps: VaultItemProps = {
      ...baseProps,
      stakedToken: TOKENS.vrt,
      userStakedWei: new BigNumber(0),
    };

    const { queryByText } = renderComponent(<VaultItem {...customBaseProps} />, {
      authContextValue: { accountAddress: fakeAddress },
    });

    // Click on withdraw button
    expect(queryByText(en.vaultItem.withdrawButton)).toBeNull();
  });
});
