import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { waitFor, fireEvent } from '@testing-library/react';

import renderComponent from 'testUtils/renderComponent';
import TransactionForm, { ITransactionFormProps } from '.';

const baseProps: ITransactionFormProps = {
  tokenId: 'xvs',
  submitButtonLabel: 'Fake submit button label',
  submitButtonDisabledLabel: 'Fake submit button disabled label',
  onSubmit: noop,
  isSubmitting: false,
  availableTokensWei: new BigNumber('100000000000000000000000'),
  availableTokensLabel: 'Available XVS',
  lockingPeriodMs: 1000 * 60 * 60 * 24 * 3, // 3 days
};

describe('pages/Vault/TransactionForm', () => {
  it('renders without crashing', async () => {
    renderComponent(<TransactionForm {...baseProps} />);
  });

  it('displays available tokens and locking period correctly', async () => {
    const { getByTestId } = renderComponent(<TransactionForm {...baseProps} />);

    expect(getByTestId('available-tokens-text').textContent).toMatchSnapshot();
    expect(getByTestId('locking-period-text').textContent).toMatchSnapshot();
  });

  it('disables submit button if no amount is provided', async () => {
    const { getByText } = renderComponent(<TransactionForm {...baseProps} />);

    // Check submit button is disabled
    const submitButton = getByText(baseProps.submitButtonDisabledLabel).closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('calls onSubmit callback on submit', async () => {
    const onSubmitMock = jest.fn();
    const customProps: ITransactionFormProps = { ...baseProps, onSubmit: onSubmitMock };

    const { getByText, getByTestId } = renderComponent(<TransactionForm {...customProps} />);

    // Check submit button is disabled
    let submitButton = getByText(baseProps.submitButtonDisabledLabel).closest('button');
    expect(submitButton).toBeDisabled();

    const fakeValueTokens = '100';

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), { target: { value: fakeValueTokens } });

    // Submit form
    submitButton = getByText(baseProps.submitButtonLabel).closest('button') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
    expect(onSubmitMock).toHaveBeenCalledWith(fakeValueTokens);
  });
});
