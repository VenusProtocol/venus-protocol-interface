import React from 'react';
import { act, waitFor, fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';

import TEST_IDS from 'constants/testIds';
import MAX_UINT256 from 'constants/maxUint256';
import { TokenId } from 'types';
import en from 'translation/translations/en.json';
import { TOKENS } from 'constants/tokens';
import fakeAddress from '__mocks__/models/address';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import {
  getAllowance,
  getXvsVaultWithdrawalRequests,
  getXvsVaultUserInfo,
  getXvsVaultPoolInfo,
  requestWithdrawalFromXvsVault,
} from 'clients/api';
import formatToWithdrawalRequest from 'clients/api/queries/getXvsVaultWithdrawalRequests/formatToWithdrawalRequest';
import formatToUserInfo from 'clients/api/queries/getXvsVaultUserInfo/formatToUserInfo';
import formatToPoolInfo from 'clients/api/queries/getXvsVaultPoolInfo/formatToPoolInfo';
import renderComponent from 'testUtils/renderComponent';
import RequestWithdrawal from '.';

jest.mock('clients/api');

const fakeStakedTokenId = TOKENS.vai.id as TokenId;
const fakePoolIndex = 6;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal/RequestWithdrawal', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => MAX_UINT256);
    (getXvsVaultWithdrawalRequests as jest.Mock).mockImplementation(() =>
      xvsVaultResponses.getWithdrawalRequests.map(formatToWithdrawalRequest),
    );
    (getXvsVaultUserInfo as jest.Mock).mockImplementation(() =>
      formatToUserInfo(xvsVaultResponses.userInfo),
    );
    (getXvsVaultPoolInfo as jest.Mock).mockImplementation(() =>
      formatToPoolInfo(xvsVaultResponses.poolInfo),
    );
  });

  it('renders without crashing', async () => {
    const { getByTestId } = renderComponent(
      <RequestWithdrawal
        stakedTokenId={fakeStakedTokenId}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.vault.transactionForm.availableTokens));
  });

  it('fetches staked tokens and locking period and displays them correctly', async () => {
    const { getByTestId } = renderComponent(
      <RequestWithdrawal
        stakedTokenId={fakeStakedTokenId}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.vault.transactionForm.availableTokens));

    expect(
      getByTestId(TEST_IDS.vault.transactionForm.availableTokens).textContent,
    ).toMatchSnapshot();
    expect(getByTestId(TEST_IDS.vault.transactionForm.lockingPeriod).textContent).toMatchSnapshot();
  });

  it('calls handleDisplayWithdrawalRequestList callback when clicking on "Withdrawal request list" button', async () => {
    const handleDisplayWithdrawalRequestListMock = jest.fn();

    const { getByText } = renderComponent(
      <RequestWithdrawal
        stakedTokenId={fakeStakedTokenId}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={handleDisplayWithdrawalRequestListMock}
      />,
      {
        authContextValue: { account: { address: fakeAddress } },
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
    const handleCloseMock = jest.fn();

    const { getByTestId, getByText } = renderComponent(
      <RequestWithdrawal
        stakedTokenId={fakeStakedTokenId}
        poolIndex={fakePoolIndex}
        handleClose={handleCloseMock}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.vault.transactionForm.availableTokens));

    const fakeValueTokens = '10';

    // Enter amount in input
    act(() => {
      fireEvent.change(getByTestId(TEST_IDS.vault.transactionForm.tokenTextField), {
        target: { value: fakeValueTokens },
      });
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

    const fakeWeiSubmitted = new BigNumber(fakeValueTokens).multipliedBy(new BigNumber(10).pow(18));

    await waitFor(() => expect(requestWithdrawalFromXvsVault).toHaveBeenCalledTimes(1));
    expect(requestWithdrawalFromXvsVault).toHaveBeenCalledWith({
      amountWei: fakeWeiSubmitted,
      fromAccountAddress: fakeAddress,
      poolIndex: fakePoolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
    });

    await waitFor(() => expect(handleCloseMock).toHaveBeenCalledTimes(1));
  });
});
