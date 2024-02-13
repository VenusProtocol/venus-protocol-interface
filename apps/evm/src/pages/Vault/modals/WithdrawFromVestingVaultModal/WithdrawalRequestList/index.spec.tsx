import { waitFor } from '@testing-library/react';
import Vi from 'vitest';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { getXvsVaultLockedDeposits } from 'clients/api';
import formatToLockedDeposit from 'clients/api/queries/getXvsVaultLockedDeposits/formatToLockedDeposit';
import { en } from 'libs/translations';

import WithdrawalRequestList from '.';
import TEST_IDS from './testIds';

const fakePoolIndex = 6;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal/WithdrawalRequestList', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1656603774626));

    (getXvsVaultLockedDeposits as Vi.Mock).mockImplementation(() => ({
      lockedDeposits: xvsVaultResponses.getWithdrawalRequests.map(formatToLockedDeposit),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<WithdrawalRequestList poolIndex={fakePoolIndex} />, {
      accountAddress: fakeAddress,
    });
  });

  it('fetches withdrawal requests and displays empty state when none was returned', async () => {
    (getXvsVaultLockedDeposits as Vi.Mock).mockImplementation(() => ({
      lockedDeposits: [],
    }));

    const { getByText } = renderComponent(<WithdrawalRequestList poolIndex={fakePoolIndex} />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() =>
      getByText(en.withdrawFromVestingVaultModalModal.withdrawalRequestList.emptyState),
    );
  });

  it('fetches withdrawal requests and displays them correctly', async () => {
    const { queryAllByTestId } = renderComponent(
      <WithdrawalRequestList poolIndex={fakePoolIndex} />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => queryAllByTestId(TEST_IDS.withdrawalRequestListItem));

    const listItems = queryAllByTestId(TEST_IDS.withdrawalRequestListItem);
    listItems.map(listItem => expect(listItem.textContent).toMatchSnapshot());
  });
});
