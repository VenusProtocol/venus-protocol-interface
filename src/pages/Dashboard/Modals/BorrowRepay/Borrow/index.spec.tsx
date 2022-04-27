import React from 'react';
import noop from 'noop-ts';
import { waitFor, fireEvent } from '@testing-library/react';

import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import Borrow from '.';

const ONE = '1';
const ONE_MILLION = '1000000';
const fakeAsset = assetData[1];

describe('pages/Dashboard/BorrowRepayModal/Borrow', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<Borrow asset={fakeAsset} onClose={noop} />);
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));
  });

  it('disables submit button if an incorrect amount is entered in input', async () => {
    const { getByText, getByTestId } = renderComponent(<Borrow asset={fakeAsset} onClose={noop} />);
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), { target: { value: ONE } });

    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButton));
    expect(
      getByText(en.borrowRepayModal.borrow.submitButton).closest('button'),
    ).not.toHaveAttribute('disabled');

    // Enter amount higher than maximum borrow limit in input
    fireEvent.change(getByTestId('token-text-field'), { target: { value: ONE_MILLION } });
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');
  });
});
