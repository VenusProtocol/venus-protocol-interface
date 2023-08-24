import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { uniqueContractInfos } from 'packages/contracts';
import React from 'react';
import { convertTokensToWei, convertWeiToTokens } from 'utilities';
import Vi from 'vitest';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import {
  getBalanceOf,
  getVaiCalculateRepayAmount,
  getVaiRepayAmountWithInterests,
  repayVai,
} from 'clients/api';
import formatToOutput from 'clients/api/queries/getVaiCalculateRepayAmount/formatToOutput';
import formatToGetVaiRepayAmountWithInterestsOutput from 'clients/api/queries/getVaiRepayAmountWithInterests/formatToOutput';
import MAX_UINT256 from 'constants/maxUint256';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import RepayVai from '.';
import TEST_IDS from '../testIds';

const VAI_CONTROLLER_CONTRACT_ADDRESS = uniqueContractInfos.vaiController.address[97]!;

vi.mock('components/Toast');
vi.mock('hooks/useSuccessfulTransactionModal');
vi.mock('hooks/useTokenApproval');

vi.useFakeTimers();

const repayInputAmountTokens = '100';

const repayInputAmountWei = convertTokensToWei({
  value: new BigNumber(repayInputAmountTokens),
  token: TOKENS.vai,
});

const getVaiRepayAmountWithInterestsResult = formatToGetVaiRepayAmountWithInterestsOutput({
  contractCallResults: fakeMulticallResponses.vaiController.getVaiRepayTotalAmount,
});

const fullRepayBalanceWei = getVaiRepayAmountWithInterestsResult.vaiRepayAmountWithInterestsWei;

const fullRepayBalanceTokens = convertWeiToTokens({
  valueWei: fullRepayBalanceWei,
  token: TOKENS.vai,
}).toString();

describe('pages/Dashboard/MintRepayVai/RepayVai', () => {
  beforeEach(() => {
    (getVaiRepayAmountWithInterests as Vi.Mock).mockImplementation(
      () => getVaiRepayAmountWithInterestsResult,
    );

    (getBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceWei: fullRepayBalanceWei,
    }));

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
    const originalTokenApprovalOutput = useTokenApproval({
      token: TOKENS.vai,
      spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
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

  it('displays the VAI repay fee correctly', async () => {
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

  it('disables submit button if token has been approved but amount entered is higher than wallet spending limit', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: TOKENS.vai,
      spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
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

  it('lets user repay some of their VAI loan', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repayVai as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText, getByPlaceholderText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: repayInputAmountTokens },
    });

    // Check input value updated correctly
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(repayInputAmountTokens));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repayVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.repayVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountWei: repayInputAmountWei,
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: TOKENS.vai,
        valueWei: repayInputAmountWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it('lets user repay their entire VAI loan', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repayVai as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText, getByTestId } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Click on max button
    fireEvent.click(getByText(en.vai.repayVai.rightMaxButtonLabel));

    // Check input value updated correctly
    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fullRepayBalanceTokens));

    // Check warning notice is displayed
    expect(getByText(en.vai.repayVai.fullRepayWarning)).toBeInTheDocument();

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repayVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.repayVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountWei: MAX_UINT256,
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: TOKENS.vai,
        valueWei: fullRepayBalanceWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  // TODO: add tests to cover failing scenarios (see VEN-631)
});
