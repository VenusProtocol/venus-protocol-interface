import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { act } from 'react-dom/test-utils';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeProvider from '__mocks__/models/provider';
import { useGetMainAssets } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Withdraw from '.';

jest.mock('clients/api');

describe('pages/ConvertVRT/Withdraw', () => {
  beforeEach(() => {
    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
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
    const withdrawXvs = jest.fn().mockReturnValue(fakeContractReceipt.transactionHash);
    const { getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          isReconnecting: false,
          provider: fakeProvider,
          accountAddress: fakeAccountAddress,
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
