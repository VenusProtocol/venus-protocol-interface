import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';
import { convertTokensToWei } from 'utilities';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import {
  getAllowance,
  getBalanceOf,
  getMintedVai,
  getVaiCalculateRepayAmount,
  getVaiRepayApy,
  repayVai,
  useGetUserMarketInfo,
} from 'clients/api';
import formatToOutput from 'clients/api/queries/getVaiCalculateRepayAmount/formatToOutput';
import MAX_UINT256 from 'constants/maxUint256';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import RepayVai from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');
jest.mock('components/Toast');
jest.mock('hooks/useSuccessfulTransactionModal');

jest.useFakeTimers();

const fakeUserVaiBalanceWei = new BigNumber(0);

const fakeUserVaiMintedWei = new BigNumber('100000000000000000000');
const repayInputAmountTokens = '100';

const fakeVai: Asset = { ...assetData[0], token: TOKENS.vai };

describe('pages/Dashboard/MintRepayVai/RepayVai', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => ({
      allowanceWei: MAX_UINT256,
    }));
    (getMintedVai as jest.Mock).mockImplementation(() => ({
      mintedVaiWei: fakeUserVaiMintedWei,
    }));
    (getBalanceOf as jest.Mock).mockImplementation(() => ({ balanceWei: fakeUserVaiBalanceWei }));
    (getVaiRepayApy as jest.Mock).mockImplementation(() => ({
      repayApyPercentage: new BigNumber(2.4653),
    }));
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [...assetData, fakeVai],
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
      },
      isLoading: false,
    }));

    (getVaiCalculateRepayAmount as jest.Mock).mockImplementation(() =>
      formatToOutput({
        repayAmountWei: convertTokensToWei({
          value: new BigNumber(repayInputAmountTokens),
          token: TOKENS.vai,
        }),
        contractCallResults: fakeMulticallResponses.vaiController.getVaiRepayInterests,
      }),
    );
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

  it('displays the correct repay VAI balance and APY', async () => {
    const { getByText, container } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.mintRepayVai.repayVai.btnRepayVai));

    expect(container.textContent).toMatchSnapshot();
  });

  it('lets user repay their VAI balance', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    (repayVai as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);
    (getBalanceOf as jest.Mock).mockImplementation(async () => ({
      balanceWei: fakeUserVaiMintedWei,
    }));

    const fakeInput = fakeUserVaiMintedWei.dividedBy(1e18);

    const { getByText, getByPlaceholderText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.mintRepayVai.repayVai.btnRepayVai));

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeInput.toFixed() } });

    // Check input value updated correctly
    expect(tokenTextFieldInput.value).toBe(fakeInput.toFixed());

    // Submit repayment request
    const submitButton = getByText(en.mintRepayVai.repayVai.btnRepayVai).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    const fakeUserWeiMinted = fakeInput.multipliedBy(new BigNumber(10).pow(18));
    expect(repayVai).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      amountWei: fakeUserWeiMinted.toFixed(),
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      amount: {
        token: TOKENS.vai,
        valueWei: fakeUserWeiMinted,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it('displays the VAI repay fee', async () => {
    (repayVai as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);
    (getBalanceOf as jest.Mock).mockImplementation(async () => ({
      balanceWei: fakeUserVaiMintedWei,
    }));

    const fakeInput = fakeUserVaiMintedWei.dividedBy(1e18);

    const { getByText, getByTestId } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.mintRepayVai.repayVai.btnRepayVai));

    // Input amount
    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeInput.toFixed() } });

    // Check input value updated correctly
    expect(tokenTextFieldInput.value).toBe(fakeInput.toFixed());

    await waitFor(() => expect(getVaiCalculateRepayAmount).toBeCalledTimes(1));

    // Check user repay VAI balance displays correctly
    await waitFor(() => getByText('0.00031735 VAI (0.000317%)'));
  });

  // @TODO: add tests to cover failing scenarios
});
