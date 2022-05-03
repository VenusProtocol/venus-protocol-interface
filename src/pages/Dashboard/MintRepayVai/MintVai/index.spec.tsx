import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { mintVai, getVaiTreasuryPercentage, useUserMarketInfo } from 'clients/api';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { formatCoinsToReadableValue } from 'utilities/common';
import { AuthContext } from 'context/AuthContext';
import { VaiContext } from 'context/VaiContext';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import RepayVai from '.';

jest.mock('clients/api');
jest.mock('components/Basic/Toast');
jest.mock('hooks/useSuccessfulTransactionModal');

const fakeAccountAddress = '0x0';
const fakeVai = { ...assetData, id: 'vai', symbol: 'VAI', isEnabled: true };
const fakeMintableVai = new BigNumber('1000');
const formattedFakeUserVaiMinted = formatCoinsToReadableValue({
  value: fakeMintableVai,
  tokenId: 'vai',
});
const fakeVaiTreasuryPercentage = 7.19;

describe('pages/Dashboard/MintRepayVai/MintVai', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: [...assetData, fakeVai],
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
  });

  it('renders without crashing', async () => {
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
        <RepayVai />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText('Available VAI limit'));
  });

  it('displays the correct available VAI limit and mint fee', async () => {
    (getVaiTreasuryPercentage as jest.Mock).mockImplementationOnce(
      async () => fakeVaiTreasuryPercentage,
    );

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
        <VaiContext.Provider
          value={{
            userVaiEnabled: true,
            userVaiMinted: new BigNumber(0),
            mintableVai: fakeMintableVai,
            userVaiBalance: new BigNumber(0),
          }}
        >
          <RepayVai />
        </VaiContext.Provider>
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText('Available VAI limit'));

    // Check available VAI limit displays correctly
    await waitFor(() => getByText(formattedFakeUserVaiMinted));
    // Check mint fee displays correctly
    await waitFor(() => getByText(`0 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  it('lets user mint VAI', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    (mintVai as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByText, getByPlaceholderText } = renderComponent(
      <VaiContext.Provider
        value={{
          userVaiEnabled: true,
          mintableVai: fakeMintableVai,
          userVaiMinted: new BigNumber(0),
          userVaiBalance: new BigNumber(0),
        }}
      >
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
          <RepayVai />
        </AuthContext.Provider>
      </VaiContext.Provider>,
    );
    await waitFor(() => getByText('Available VAI limit'));

    // Click on "SAFE MAX" button
    const safeMaxButton = getByText('SAFE MAX').closest('button') as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value updated to max amount of mintable VAI
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeMintableVai.toString()));

    // Submit repayment request
    const submitButton = getByText('Mint VAI').closest('button') as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toHaveProperty('disabled', false));
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    const fakeWeiMinted = fakeMintableVai.multipliedBy(new BigNumber(10).pow(18));
    expect(mintVai).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      amountWei: fakeWeiMinted,
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      amount: {
        tokenId: 'xvs',
        valueWei: fakeWeiMinted,
      },
      message: expect.any(String),
      title: expect.any(String),
    });
  });
  // @TODO: add tests to cover failing scenarios
});
