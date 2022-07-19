import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import React from 'react';
import { TokenId } from 'types';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { executeWithdrawalFromXvsVault, getXvsVaultLockedDeposits } from 'clients/api';
import formatToLockedDeposit from 'clients/api/queries/getXvsVaultLockedDeposits/formatToLockedDeposit';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Withdraw from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

const fakePoolIndex = 6;
const fakeStokedTokenId = TOKENS.vai.id as TokenId;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal/Withdraw', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date(1656603774626));
    (getXvsVaultLockedDeposits as jest.Mock).mockImplementation(() =>
      xvsVaultResponses.getWithdrawalRequests.map(formatToLockedDeposit),
    );
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedTokenId={fakeStokedTokenId} handleClose={noop} />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() => getByText(en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton));
  });

  it('fetches available tokens amount and displays it correctly', async () => {
    const { getByTestId } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedTokenId={fakeStokedTokenId} handleClose={noop} />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot();
  });

  it('disables submit button when there is no tokens available', async () => {
    (getXvsVaultLockedDeposits as jest.Mock).mockImplementation(() => []);

    const { getByTestId, getByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedTokenId={fakeStokedTokenId} handleClose={noop} />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    const submitButton = getByText(
      en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton,
    ).closest('button') as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('lets user withdraw their available tokens and calls handleClose callback on success', async () => {
    const handleCloseMock = jest.fn();

    const { getByTestId, getByText } = renderComponent(
      <Withdraw
        poolIndex={fakePoolIndex}
        stakedTokenId={fakeStokedTokenId}
        handleClose={handleCloseMock}
      />,
      {
        authContextValue: { account: { address: fakeAddress } },
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
      fromAccountAddress: fakeAddress,
      rewardTokenAddress: TOKENS.xvs.address,
    });

    await waitFor(() => expect(handleCloseMock).toHaveBeenCalledTimes(1));
  });
});
