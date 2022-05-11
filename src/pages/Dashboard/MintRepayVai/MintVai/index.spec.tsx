import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import en from 'translation/translations/en.json';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { mintVai, getVaiTreasuryPercentage, useUserMarketInfo } from 'clients/api';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { formatCoinsToReadableValue } from 'utilities/common';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import fakeAccountAddress from '__mocks__/models/address';
import RepayVai from '.';

jest.mock('clients/api');
jest.mock('components/Basic/Toast');
jest.mock('hooks/useSuccessfulTransactionModal');

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
    const { getByText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.mintRepayVai.mintVai.enableToken));
  });

  it('displays the correct available VAI limit and mint fee', async () => {
    (getVaiTreasuryPercentage as jest.Mock).mockImplementationOnce(
      async () => fakeVaiTreasuryPercentage,
    );

    const { getByText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
      vaiContextValue: {
        userVaiEnabled: true,
        userVaiMinted: new BigNumber(0),
        mintableVai: fakeMintableVai,
        userVaiBalance: new BigNumber(0),
      },
    });

    // Check available VAI limit displays correctly
    await waitFor(() => getByText(formattedFakeUserVaiMinted));
    // Check mint fee displays correctly
    await waitFor(() => getByText(`0 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  it('lets user mint VAI', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    (mintVai as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByText, getByPlaceholderText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
      vaiContextValue: {
        userVaiEnabled: true,
        mintableVai: fakeMintableVai,
        userVaiMinted: new BigNumber(0),
        userVaiBalance: new BigNumber(0),
      },
    });
    await waitFor(() => getByText(en.mintRepayVai.mintVai.btnMintVai));

    // Click on "SAFE MAX" button
    const safeMaxButton = getByText(en.mintRepayVai.mintVai.rightMaxButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value updated to max amount of mintable VAI
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeMintableVai.toFixed()));

    // Submit repayment request
    const submitButton = getByText(en.mintRepayVai.mintVai.btnMintVai).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toBeEnabled());
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
