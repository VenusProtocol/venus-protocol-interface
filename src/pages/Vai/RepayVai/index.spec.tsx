import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';
import Vi from 'vitest';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import {
  getBalanceOf,
  getMintedVai,
  getVaiCalculateRepayAmount,
  getVaiRepayAmountWithInterests,
  repayVai,
} from 'clients/api';
import formatToOutput from 'clients/api/queries/getVaiCalculateRepayAmount/formatToOutput';
import formatToGetVaiRepayAmountWithInterestsOutput from 'clients/api/queries/getVaiRepayAmountWithInterests/formatToOutput';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import RepayVai from '.';
import TEST_IDS from '../testIds';

vi.mock('clients/api');
vi.mock('components/Toast');
vi.mock('hooks/useSuccessfulTransactionModal');
vi.mock('hooks/useTokenApproval');

vi.useFakeTimers();

const fakeUserVaiMintedWei = new BigNumber('100000000000000000000');
const repayInputAmountTokens = '100';

describe('pages/Dashboard/MintRepayVai/RepayVai', () => {
  beforeEach(() => {
    (getMintedVai as Vi.Mock).mockImplementation(() => ({
      mintedVaiWei: fakeUserVaiMintedWei,
    }));

    (getVaiRepayAmountWithInterests as Vi.Mock).mockImplementation(() =>
      formatToGetVaiRepayAmountWithInterestsOutput({
        contractCallResults: fakeMulticallResponses.vaiController.getVaiRepayTotalAmount,
      }),
    );

    (getVaiCalculateRepayAmount as Vi.Mock).mockImplementation(() =>
      formatToOutput({
        repayAmountWei: convertTokensToWei({
          value: new BigNumber(repayInputAmountTokens),
          token: TOKENS.vai,
        }),
        contractCallResults: fakeMulticallResponses.vaiController.getVaiRepayInterests,
      }),
    );
  });

  it('renders without crashing', () => {
    renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
  });

  it('displays the correct repay VAI balance and APY', async () => {
    const { getByText, container } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays the wallet spending limit correctly and lets user revoke it', async () => {
    (getBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceWei: fakeUserVaiMintedWei,
    }));

    const originalTokenApprovalOutput = useTokenApproval({
      token: TOKENS.vai,
      spenderAddress: getContractAddress('vaiController'),
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check spending limit is correctly displayed
    await waitFor(() => getByTestId(TEST_IDS.spendingLimit));
    expect(getByTestId(TEST_IDS.spendingLimit).textContent).toMatchSnapshot();

    // Press on revoke button
    const revokeSpendingLimitButton = within(getByTestId(TEST_IDS.spendingLimit)).getByRole(
      'button',
    );

    fireEvent.click(revokeSpendingLimitButton);

    await waitFor(() => expect(fakeRevokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('disables submit button if token has been approved but amount entered is higher than wallet spending limit', async () => {
    (getBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceWei: fakeUserVaiMintedWei,
    }));

    const originalTokenApprovalOutput = useTokenApproval({
      token: TOKENS.vai,
      spenderAddress: getContractAddress('vaiController'),
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId, getByText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Enter amount in input
    const incorrectValueTokens = fakeWalletSpendingLimitTokens
      // Add one token too much
      .plus(1)
      .toFixed();

    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is still disabled
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));
    expect(getByText(en.vai.repayVai.submitButtonDisabledLabel).closest('button')).toBeDisabled();
  });

  it('lets user repay their VAI balance', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repayVai as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    (getBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceWei: fakeUserVaiMintedWei,
    }));

    const { getByText, getByPlaceholderText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Input amount
    const fakeUserVaiMinted = convertWeiToTokens({
      valueWei: fakeUserVaiMintedWei,
      token: TOKENS.vai,
    });

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeUserVaiMinted.toFixed() } });

    // Check input value updated correctly
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeUserVaiMinted.toFixed()));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repayVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.repayVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountWei: fakeUserVaiMintedWei,
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: TOKENS.vai,
        valueWei: fakeUserVaiMintedWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it('displays the VAI repay fee', async () => {
    const { getByText, getByTestId } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() => getByText(en.vai.repayVai.repayFeeLabel));

    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: repayInputAmountTokens } });

    // Check user repay VAI balance displays correctly
    await waitFor(() => getByText('0.00031 VAI (0.000317%)'));
  });

  // TODO: add tests to cover failing scenarios (see VEN-631)
});
