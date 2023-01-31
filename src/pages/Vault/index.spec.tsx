import React from 'react';

import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { useGetVaults } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import Vault from '.';
import TEST_IDS from './VaultItem/testIds';

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

    const symbolsElements = queryAllByTestId(TEST_IDS.symbol);
    const userStakedTokensElements = queryAllByTestId(TEST_IDS.userStakedTokens);
    const dataListItemElements = queryAllByTestId(TEST_IDS.dataListItem);

    symbolsElements.map(symbolsElement => expect(symbolsElement.textContent).toMatchSnapshot());
    userStakedTokensElements.map(userStakedTokensElement =>
      expect(userStakedTokensElement.textContent).toMatchSnapshot(),
    );
    dataListItemElements.map(dataListItemElement =>
      expect(dataListItemElement.textContent).toMatchSnapshot(),
    );
  });
});
