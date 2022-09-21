import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { TokenId } from 'types';
import { convertWeiToTokens } from 'utilities';

import comptrollerResponses from '__mocks__/contracts/comptroller';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import {
  getAllowance,
  getBalanceOf,
  getMintedVai,
  repayVai,
  useGetUserMarketInfo,
} from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import RepayVai from '.';

jest.mock('clients/api');
jest.mock('components/Toast');
jest.mock('hooks/useSuccessfulTransactionModal');

const fakeUserVaiMintedWei = new BigNumber(comptrollerResponses.mintedVAIs);
const fakeVai = { ...assetData, id: 'vai', symbol: 'VAI' };

describe('pages/Dashboard/MintRepayVai/RepayVai', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => ({
      allowanceWei: MAX_UINT256,
    }));

    (getMintedVai as jest.Mock).mockImplementation(() => ({
      mintedVaiWei: fakeUserVaiMintedWei,
    }));

    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [...assetData, fakeVai],
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
  });

  it('displays the correct repay VAI balance', async () => {
    const { getByText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Check user repay VAI balance displays correctly
    const readableFakeMintedVai = convertWeiToTokens({
      valueWei: fakeUserVaiMintedWei,
      tokenId: TOKENS.vai.id as TokenId,
      returnInReadableFormat: true,
    });

    await waitFor(() => getByText(readableFakeMintedVai));
  });

  it('lets user repay their VAI balance', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repayVai as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    (getBalanceOf as jest.Mock).mockImplementation(() => ({
      balanceWei: fakeUserVaiMintedWei,
    }));

    const { getByText, getByPlaceholderText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Input amount
    const fakeUserVaiMinted = convertWeiToTokens({
      valueWei: fakeUserVaiMintedWei,
      tokenId: TOKENS.vai.id as TokenId,
    });

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeUserVaiMinted.toFixed() } });

    // Check input value updated correctly
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeUserVaiMinted.toFixed()));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repayVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.repayVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      amountWei: fakeUserVaiMintedWei.toFixed(),
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      amount: {
        tokenId: 'vai',
        valueWei: fakeUserVaiMintedWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  // TODO: add tests to cover failing scenarios (see VEN-631)
});
