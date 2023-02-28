import { waitFor } from '@testing-library/react';
import React from 'react';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { getXvsVaultLockedDeposits } from 'clients/api';
import formatToLockedDeposit from 'clients/api/queries/getXvsVaultLockedDeposits/formatToLockedDeposit';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import WithdrawalRequestList from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

const fakePoolIndex = 6;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal/WithdrawalRequestList', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date(1656603774626));

    (getXvsVaultLockedDeposits as jest.Mock).mockImplementation(() => ({
      lockedDeposits: xvsVaultResponses.getWithdrawalRequests.map(formatToLockedDeposit),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<WithdrawalRequestList poolIndex={fakePoolIndex} />, {
      authContextValue: { accountAddress: fakeAddress },
    });
  });

  it('fetches withdrawal requests and displays empty state when none was returned', async () => {
    (getXvsVaultLockedDeposits as jest.Mock).mockImplementation(() => ({
      lockedDeposits: [],
    }));

    const { getByText } = renderComponent(<WithdrawalRequestList poolIndex={fakePoolIndex} />, {
      authContextValue: { accountAddress: fakeAddress },
    });

    await waitFor(() =>
      getByText(en.withdrawFromVestingVaultModalModal.withdrawalRequestList.emptyState),
    );
  });

  it('fetches withdrawal requests and displays them correctly', async () => {
    const { queryAllByTestId } = renderComponent(
      <WithdrawalRequestList poolIndex={fakePoolIndex} />,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    await waitFor(() => queryAllByTestId(TEST_IDS.withdrawalRequestListItem));

    const listItems = queryAllByTestId(TEST_IDS.withdrawalRequestListItem);
    listItems.map(listItem => expect(listItem.textContent).toMatchSnapshot());
  });
});
