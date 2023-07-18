import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';

import TransactionForm, { TransactionFormProps } from '.';
import TEST_IDS from './testIds';

vi.mock('hooks/useSuccessfulTransactionModal');
vi.mock('hooks/useTokenApproval');

const baseProps: TransactionFormProps = {
  token: TOKENS.xvs,
  submitButtonLabel: 'Fake submit button label',
  submitButtonDisabledLabel: 'Fake submit button disabled label',
  onSubmit: noop,
  isSubmitting: false,
  availableTokensWei: new BigNumber('100000000000000000000000'),
  availableTokensLabel: 'Available XVS',
  successfulTransactionTitle: 'Fake successful transaction modal title',
  successfulTransactionDescription: 'Fake successful transaction modal description',
  lockingPeriodMs: 1000 * 60 * 60 * 24 * 3, // 3 days
};

describe('pages/Vault/TransactionForm', () => {
  it('renders without crashing', async () => {
    renderComponent(<TransactionForm {...baseProps} />);
  });

  it('displays available tokens and locking period correctly', async () => {
    const { getByTestId } = renderComponent(<TransactionForm {...baseProps} />);

    expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot();
    expect(getByTestId(TEST_IDS.lockingPeriod).textContent).toMatchSnapshot();
  });

  it('displays the wallet spending limit correctly and lets user revoke it', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: TOKENS.vai,
      spenderAddress: '',
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId } = renderComponent(
      () => <TransactionForm tokenNeedsToBeApproved {...baseProps} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    // Check spending limit is correctly displayedy
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
    const originalTokenApprovalOutput = useTokenApproval({
      token: TOKENS.vai,
      spenderAddress: '',
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId, getByText } = renderComponent(
      () => <TransactionForm tokenNeedsToBeApproved {...baseProps} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(baseProps.submitButtonDisabledLabel));

    // Enter amount in input
    const incorrectValueTokens = fakeWalletSpendingLimitTokens
      // Add one token too much
      .plus(1)
      .toFixed();

    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is still disabled
    await waitFor(() => getByText(baseProps.submitButtonDisabledLabel));
    expect(getByText(baseProps.submitButtonDisabledLabel).closest('button')).toBeDisabled();
  });

  it('disables submit button if no amount is provided', async () => {
    const { getByText } = renderComponent(<TransactionForm {...baseProps} />);

    // Check submit button is disabled
    const submitButton = getByText(baseProps.submitButtonDisabledLabel).closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('calls onSubmit callback on submit and displays successful transaction modal', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    const onSubmitMock = vi.fn(async () => fakeContractReceipt);
    const customProps: TransactionFormProps = { ...baseProps, onSubmit: onSubmitMock };

    const { getByText, getByTestId } = renderComponent(<TransactionForm {...customProps} />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check submit button is disabled
    let submitButton = getByText(baseProps.submitButtonDisabledLabel).closest('button');
    expect(submitButton).toBeDisabled();

    const fakeValueTokens = '100';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: fakeValueTokens },
    });

    // Submit form
    submitButton = getByText(baseProps.submitButtonLabel).closest('button') as HTMLButtonElement;
    fireEvent.click(submitButton);

    const fakeWeiSubmitted = new BigNumber(fakeValueTokens).multipliedBy(new BigNumber(10).pow(18));

    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
    expect(onSubmitMock).toHaveBeenCalledWith(fakeWeiSubmitted);

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: baseProps.token,
        valueWei: fakeWeiSubmitted,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });
});
