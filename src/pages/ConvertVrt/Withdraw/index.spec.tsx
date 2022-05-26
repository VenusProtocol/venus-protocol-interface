import React from 'react';
import BigNumber from 'bignumber.js';
import { fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import { AuthContext } from 'context/AuthContext';
import fakeAccountAddress from '__mocks__/models/address';
import transactionReceipt from '__mocks__/models/transactionReceipt';
import { useGetUserMarketInfo } from 'clients/api';
import en from 'translation/translations/en.json';
import Withdraw from '.';

jest.mock('clients/api');

describe('pages/ConvertVRT/Withdraw', () => {
  beforeEach(() => {
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimit: new BigNumber('111'),
        userTotalBorrowBalance: new BigNumber('91'),
        userTotalSupplyBalance: new BigNumber('910'),
      },
      isLoading: false,
    }));
  });

  it('submit button is enabled with input, good vesting period and not loading', async () => {
    const withdrawXvs = jest.fn().mockReturnValue(transactionReceipt.transactionHash);
    const { getByText } = renderComponent(
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
        <Withdraw
          xvsWithdrawableAmount={new BigNumber(9999)}
          withdrawXvs={withdrawXvs}
          withdrawXvsLoading={false}
        />
      </AuthContext.Provider>,
    );
    const submitButton = getByText(en.convertVrt.withdrawXvs).closest(
      'button',
    ) as HTMLButtonElement;
    expect(submitButton).toBeEnabled();
    await act(async () => {
      await waitFor(() => fireEvent.click(submitButton));
    });
    await waitFor(() => expect(withdrawXvs).toHaveBeenCalledTimes(1));
    // Show modal
    getByText(en.convertVrt.successfulConvertTransactionModal.title);
  });
});
