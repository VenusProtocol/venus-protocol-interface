import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useUserMarketInfo, borrowVToken } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import Borrow from '.';

const ONE = '1';
const ONE_MILLION = '1000000';
const fakeAsset = assetData[0];

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

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

  it('lets user borrow tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (borrowVToken as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

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
        <Borrow asset={fakeAsset} onClose={onCloseMock} />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), { target: { value: ONE } });

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.borrow.submitButton));

    const expectedAmountWei = new BigNumber(ONE).multipliedBy(
      new BigNumber(10).pow(fakeAsset.decimals),
    );

    await waitFor(() => expect(borrowVToken).toHaveBeenCalledTimes(1));
    expect(borrowVToken).toHaveBeenCalledWith({
      amountWei: expectedAmountWei,
      fromAccountAddress: fakeAccountAddress,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      amount: {
        tokenId: fakeAsset.id,
        valueWei: expectedAmountWei,
      },
      message: expect.any(String),
      title: expect.any(String),
    });
  });
});
