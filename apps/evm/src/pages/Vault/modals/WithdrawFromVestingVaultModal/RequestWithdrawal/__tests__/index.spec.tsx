import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { xvsVaultPoolInfo, xvsVaultUserInfo } from '__mocks__/models/vaults';
import {
  getXvsVaultLockedDeposits,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { en } from 'libs/translations';

import { lockedDeposits } from '__mocks__/models/vaults';
import RequestWithdrawal from '..';
import TEST_IDS from '../../../../TransactionForm/testIds';

const fakeStakedToken = vai;
const fakePoolIndex = 6;

describe('RequestWithdrawal', () => {
  beforeEach(() => {
    (getXvsVaultLockedDeposits as Mock).mockImplementation(() => ({
      lockedDeposits,
    }));
    (getXvsVaultUserInfo as Mock).mockImplementation(() => xvsVaultUserInfo);
    (getXvsVaultPoolInfo as Mock).mockImplementation(() => xvsVaultPoolInfo);
  });

  it('renders without crashing', async () => {
    const { getByTestId } = renderComponent(
      <RequestWithdrawal
        stakedToken={fakeStakedToken}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { queryByText } = renderComponent(
      <RequestWithdrawal
        stakedToken={fakeStakedToken}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={noop}
      />,
    );

    // Check connect button is present
    await waitFor(() => expect(queryByText(en.connectWallet.connectButton)).toBeInTheDocument());
  });

  it('fetches staked tokens and locking period and displays them correctly', async () => {
    const { getByTestId } = renderComponent(
      <RequestWithdrawal
        stakedToken={fakeStakedToken}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot();
    expect(getByTestId(TEST_IDS.lockingPeriod).textContent).toMatchSnapshot();
  });

  it('calls handleDisplayWithdrawalRequestList callback when clicking on "Withdrawal request list" button', async () => {
    const handleDisplayWithdrawalRequestListMock = vi.fn();

    const { getByText } = renderComponent(
      <RequestWithdrawal
        stakedToken={fakeStakedToken}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={handleDisplayWithdrawalRequestListMock}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() =>
      getByText(
        en.withdrawFromVestingVaultModalModal.requestWithdrawalTab
          .displayWithdrawalRequestListButton,
      ),
    );

    fireEvent.click(
      getByText(
        en.withdrawFromVestingVaultModalModal.requestWithdrawalTab
          .displayWithdrawalRequestListButton,
      ),
    );

    await waitFor(() => expect(handleDisplayWithdrawalRequestListMock).toHaveBeenCalledTimes(1));
  });

  it('lets user request a withdrawal and calls handleClose callback on success', async () => {
    const mockRequestWithdrawalFromXvsVault = vi.fn();
    (useRequestWithdrawalFromXvsVault as Mock).mockImplementation(() => ({
      mutateAsync: mockRequestWithdrawalFromXvsVault,
    }));

    const handleCloseMock = vi.fn();

    const { getByTestId, getByText } = renderComponent(
      <RequestWithdrawal
        stakedToken={fakeStakedToken}
        poolIndex={fakePoolIndex}
        handleClose={handleCloseMock}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    const fakeValueTokens = '10';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: fakeValueTokens },
    });

    // Submit form
    await waitFor(() =>
      expect(
        getByText(en.withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonLabel),
      ),
    );

    const submitButton = getByText(
      en.withdrawFromVestingVaultModalModal.requestWithdrawalTab.submitButtonLabel,
    ).closest('button') as HTMLButtonElement;

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockRequestWithdrawalFromXvsVault).toHaveBeenCalledTimes(1));
    expect(mockRequestWithdrawalFromXvsVault.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "amountMantissa": 10000000000000000000n,
          "poolIndex": 6,
          "rewardTokenAddress": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
        },
      ]
    `);

    await waitFor(() => expect(handleCloseMock).toHaveBeenCalledTimes(1));
  });
});
