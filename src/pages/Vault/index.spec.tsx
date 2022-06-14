import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import { useGetVaults } from 'clients/api';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import {
  SYMBOL_TEST_ID,
  USER_PENDING_REWARD_TOKENS_TEST_ID,
  USER_STAKED_TOKENS_TEST_ID,
  DATA_LIST_ITEM_TEST_ID,
} from './VaultItem';
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

  it('renders vault correctly', async () => {
    const { queryAllByTestId } = renderComponent(<Vault />);

    const symbolsElements = queryAllByTestId(SYMBOL_TEST_ID);
    const userPendingRewardTokensElements = queryAllByTestId(USER_PENDING_REWARD_TOKENS_TEST_ID);
    const userStakedTokensElements = queryAllByTestId(USER_STAKED_TOKENS_TEST_ID);
    const dataListItemElements = queryAllByTestId(DATA_LIST_ITEM_TEST_ID);

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
