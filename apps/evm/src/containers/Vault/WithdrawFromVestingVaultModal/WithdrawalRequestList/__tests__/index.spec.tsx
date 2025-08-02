import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { useGetXvsVaultLockedDeposits } from 'clients/api';
import { en } from 'libs/translations';

import { lockedDeposits } from '__mocks__/models/vaults';
import WithdrawalRequestList from '..';
import TEST_IDS from '../testIds';

const fakePoolIndex = 6;

describe('WithdrawalRequestList', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1656603774626));

    (useGetXvsVaultLockedDeposits as Mock).mockImplementation(() => ({
      data: {
        lockedDeposits,
      },
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<WithdrawalRequestList poolIndex={fakePoolIndex} />, {
      accountAddress: fakeAddress,
    });
  });

  it('fetches withdrawal requests and displays empty state when none was returned', async () => {
    (useGetXvsVaultLockedDeposits as Mock).mockImplementation(() => ({
      data: {
        lockedDeposits: [],
      },
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
