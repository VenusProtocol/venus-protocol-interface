import React from 'react';
import { waitFor } from '@testing-library/react';

import TEST_IDS from 'constants/testIds';
import fakeAddress from '__mocks__/models/address';
import en from 'translation/translations/en.json';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import { getXvsVaultWithdrawalRequests } from 'clients/api';
import formatToWithdrawalRequest from 'clients/api/queries/getXvsVaultWithdrawalRequests/formatToWithdrawalRequest';
import renderComponent from 'testUtils/renderComponent';
import WithdrawalRequestList from '.';

jest.mock('clients/api');

const fakePoolIndex = 6;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal/WithdrawalRequestList', () => {
  beforeEach(() => {
    (getXvsVaultWithdrawalRequests as jest.Mock).mockImplementation(() =>
      xvsVaultResponses.getWithdrawalRequests.map(formatToWithdrawalRequest),
    );
  });

  it('renders without crashing', async () => {
    renderComponent(<WithdrawalRequestList poolIndex={fakePoolIndex} />, {
      authContextValue: { account: { address: fakeAddress } },
    });
  });

  it('fetches withdrawal requests and displays empty state when none was returned', async () => {
    (getXvsVaultWithdrawalRequests as jest.Mock).mockImplementation(() => []);

    const { getByText } = renderComponent(<WithdrawalRequestList poolIndex={fakePoolIndex} />, {
      authContextValue: { account: { address: fakeAddress } },
    });

    await waitFor(() =>
      getByText(en.withdrawFromVestingVaultModalModal.withdrawalRequestList.emptyState),
    );
  });

  it('fetches withdrawal requests and displays them correctly', async () => {
    const { queryAllByTestId } = renderComponent(
      <WithdrawalRequestList poolIndex={fakePoolIndex} />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() =>
      queryAllByTestId(
        TEST_IDS.vault.vaultItem.withdrawFromVestingVaultModal.withdrawalRequestListItem,
      ),
    );

    const listItems = queryAllByTestId(
      TEST_IDS.vault.vaultItem.withdrawFromVestingVaultModal.withdrawalRequestListItem,
    );
    listItems.map(listItem => expect(listItem.textContent).toMatchSnapshot());
  });
});
