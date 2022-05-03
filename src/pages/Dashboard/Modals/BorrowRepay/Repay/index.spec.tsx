import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useUserMarketInfo, repayNonBnbVToken } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import Repay from '.';

const fakeTokenBorrowBalanceTokens = new BigNumber('10000');
const fakeAssets = assetData.map((asset, index) => ({
  ...asset,
  isEnabled: true,
  walletBalance: index === 3 ? fakeTokenBorrowBalanceTokens : asset.walletBalance,
  borrowBalance: index === 3 ? fakeTokenBorrowBalanceTokens : asset.borrowBalance,
}));
const fakeAsset = fakeAssets[3];

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('pages/Dashboard/BorrowRepayModal/Repay', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: fakeAssets,
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} onClose={noop} isXvsEnabled />);
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
        <Repay asset={fakeAsset} onClose={noop} isXvsEnabled />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), {
      target: { value: fakeAsset.borrowBalance.toFixed() },
    });

    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButton));
    expect(getByText(en.borrowRepayModal.repay.submitButton).closest('button')).not.toHaveAttribute(
      'disabled',
    );

    // Enter amount higher than maximum borrow limit in input
    fireEvent.change(getByTestId('token-text-field'), {
      target: { value: fakeAsset.borrowBalance.plus(1).toFixed() },
    });
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');
  });

  it('lets user repay borrowed tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repayNonBnbVToken as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

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
        <Repay asset={fakeAsset} onClose={onCloseMock} isXvsEnabled />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), {
      target: { value: fakeAsset.borrowBalance.toFixed() },
    });

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.repay.submitButton));

    const expectedAmountWei = fakeAsset.borrowBalance.multipliedBy(
      new BigNumber(10).pow(fakeAsset.decimals),
    );

    await waitFor(() => expect(repayNonBnbVToken).toHaveBeenCalledTimes(1));
    expect(repayNonBnbVToken).toHaveBeenCalledWith({
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
