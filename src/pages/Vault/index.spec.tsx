import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import { useGetVaults } from 'clients/api';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import TEST_IDS from 'constants/testIds';
import Vault from '.';

jest.mock('clients/api');

describe('pages/Vault', () => {
  beforeEach(() => {
    (useGetVaults as jest.Mock).mockImplementation(() => ({
      data: fakeVaults,
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Vault />);
  });

  it('renders vaults correctly', async () => {
    const { queryAllByTestId } = renderComponent(<Vault />);

    const symbolsElements = queryAllByTestId(TEST_IDS.vault.vaultItem.symbol);
    const userPendingRewardTokensElements = queryAllByTestId(
      TEST_IDS.vault.vaultItem.userPendingRewardTokens,
    );
    const userStakedTokensElements = queryAllByTestId(TEST_IDS.vault.vaultItem.userStakedTokens);
    const dataListItemElements = queryAllByTestId(TEST_IDS.vault.vaultItem.dataListItem);

    symbolsElements.map(symbolsElement => expect(symbolsElement.textContent).toMatchSnapshot());
    userPendingRewardTokensElements.map(userPendingRewardTokensElement =>
      expect(userPendingRewardTokensElement.textContent).toMatchSnapshot(),
    );
    userStakedTokensElements.map(userStakedTokensElement =>
      expect(userStakedTokensElement.textContent).toMatchSnapshot(),
    );
    dataListItemElements.map(dataListItemElement =>
      expect(dataListItemElement.textContent).toMatchSnapshot(),
    );
  });
});
