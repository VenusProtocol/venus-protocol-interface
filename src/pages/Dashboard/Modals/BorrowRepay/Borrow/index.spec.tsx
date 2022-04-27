import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import Borrow from '.';

const ONE = '1';
const ONE_MILLION = '1000000';
const fakeAsset = assetData[1];

jest.mock('clients/api');

describe('pages/Dashboard/BorrowRepayModal/Borrow', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: assetData,
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Borrow asset={fakeAsset} onClose={noop} />);
  });

  it('disables submit button if an incorrect amount is entered in input', async () => {
    const { getByText, getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          account: {
            address: fakeAccountAddress,
          },
        }}
      >
        <Borrow asset={fakeAsset} onClose={noop} />
      </AuthContext.Provider>,
    );
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
