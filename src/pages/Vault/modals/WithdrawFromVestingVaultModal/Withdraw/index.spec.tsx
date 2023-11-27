import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import { en } from 'packages/translations';
import React from 'react';
import Vi from 'vitest';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { vai, xvs } from '__mocks__/models/tokens';
import { executeWithdrawalFromXvsVault, getXvsVaultLockedDeposits } from 'clients/api';
import formatToLockedDeposit from 'clients/api/queries/getXvsVaultLockedDeposits/formatToLockedDeposit';
import { renderComponent } from 'testUtils/render';

import Withdraw from '.';
import TEST_IDS from './testIds';

const fakePoolIndex = 6;
const fakeStakedToken = vai;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal/Withdraw', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1656603774626));
    (getXvsVaultLockedDeposits as Vi.Mock).mockImplementation(() => ({
      lockedDeposits: xvsVaultResponses.getWithdrawalRequests.map(formatToLockedDeposit),
    }));
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByText(en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton));
  });

  it('fetches available tokens amount and displays it correctly', async () => {
    const { getByTestId } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot();
  });

  it('disables submit button when there is no tokens available', async () => {
    (getXvsVaultLockedDeposits as Vi.Mock).mockImplementation(() => ({
      lockedDeposits: [],
    }));

    const { getByTestId, getByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    const submitButton = getByText(
      en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton,
    ).closest('button') as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('lets user withdraw their available tokens and calls handleClose callback on success', async () => {
    const handleCloseMock = vi.fn();

    const { getByTestId, getByText } = renderComponent(
      <Withdraw
        poolIndex={fakePoolIndex}
        stakedToken={fakeStakedToken}
        handleClose={handleCloseMock}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    const submitButton = getByText(
      en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton,
    ).closest('button') as HTMLButtonElement;

    // Click on submit button
    fireEvent.click(submitButton);

    await waitFor(() => expect(executeWithdrawalFromXvsVault).toHaveBeenCalledTimes(1));
    expect(executeWithdrawalFromXvsVault).toHaveBeenCalledWith({
      poolIndex: fakePoolIndex,
      rewardTokenAddress: xvs.address,
    });

    await waitFor(() => expect(handleCloseMock).toHaveBeenCalledTimes(1));
  });
});
