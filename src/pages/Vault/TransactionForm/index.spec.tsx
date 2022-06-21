import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { waitFor, fireEvent } from '@testing-library/react';

import TEST_IDS from 'constants/testIds';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import TransactionForm, { ITransactionFormProps } from '.';

jest.mock('hooks/useSuccessfulTransactionModal');

const baseProps: ITransactionFormProps = {
  tokenId: 'xvs',
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

    expect(
      getByTestId(TEST_IDS.vault.transactionForm.availableTokens).textContent,
    ).toMatchSnapshot();
    expect(getByTestId(TEST_IDS.vault.transactionForm.lockingPeriod).textContent).toMatchSnapshot();
  });

  it('disables submit button if no amount is provided', async () => {
    const { getByText } = renderComponent(<TransactionForm {...baseProps} />);

    // Check submit button is disabled
    const submitButton = getByText(baseProps.submitButtonDisabledLabel).closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('calls onSubmit callback on submit and displays successful transaction modal', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    const onSubmitMock = jest.fn(async () => fakeTransactionReceipt);
    const customProps: ITransactionFormProps = { ...baseProps, onSubmit: onSubmitMock };

    const { getByText, getByTestId } = renderComponent(<TransactionForm {...customProps} />);

    // Check submit button is disabled
    let submitButton = getByText(baseProps.submitButtonDisabledLabel).closest('button');
    expect(submitButton).toBeDisabled();

    const fakeValueTokens = '100';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.vault.transactionForm.tokenTextField), {
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
      transactionHash: fakeTransactionReceipt.transactionHash,
      amount: {
        tokenId: baseProps.tokenId,
        valueWei: fakeWeiSubmitted,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });
});
