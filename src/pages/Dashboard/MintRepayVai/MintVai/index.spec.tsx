import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { formatTokensToReadableValue } from 'utilities';

import vaiUnitrollerResponses from '__mocks__/contracts/vaiController';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import {
  getAllowance,
  getMintableVai,
  getVaiTreasuryPercentage,
  mintVai,
  useGetUserMarketInfo,
} from 'clients/api';
import formatToGetMintableVaiOutput from 'clients/api/queries/getMintableVai/formatToOutput';
import MAX_UINT256 from 'constants/maxUint256';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import RepayVai from '.';

jest.mock('clients/api');
jest.mock('components/Toast');
jest.mock('hooks/useSuccessfulTransactionModal');

const fakeVai = { ...assetData[0], token: TOKENS.vai };

const fakeGetMintableVaiOutput = formatToGetMintableVaiOutput(
  vaiUnitrollerResponses.getMintableVAI,
);

const fakeMintableVaiTokens = fakeGetMintableVaiOutput.mintableVaiWei.dividedBy(1e18);
const formattedFakeMintableVai = formatTokensToReadableValue({
  value: fakeMintableVaiTokens,
  token: TOKENS.vai,
});
const fakeVaiTreasuryPercentage = 7.19;

describe('pages/Dashboard/MintRepayVai/MintVai', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => ({
      allowanceWei: MAX_UINT256,
    }));
    (getMintableVai as jest.Mock).mockImplementation(() => fakeGetMintableVaiOutput);
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

  it('displays the correct available VAI limit and mint fee', async () => {
    (getVaiTreasuryPercentage as jest.Mock).mockImplementationOnce(async () => ({
      percentage: fakeVaiTreasuryPercentage,
    }));

    const { getByText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Check available VAI limit displays correctly
    await waitFor(() => getByText(formattedFakeMintableVai));
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
    });
    await waitFor(() => getByText(en.mintRepayVai.mintVai.btnMintVai));

    // Click on "SAFE MAX" button
    const safeMaxButton = getByText(en.mintRepayVai.mintVai.rightMaxButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value updated to max amount of mintable VAI
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeMintableVaiTokens.toFixed()));

    // Submit repayment request
    const submitButton = getByText(en.mintRepayVai.mintVai.btnMintVai).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    const fakeWeiMinted = fakeMintableVaiTokens.multipliedBy(1e18);
    expect(mintVai).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      amountWei: fakeWeiMinted,
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      amount: {
        token: TOKENS.vai,
        valueWei: fakeWeiMinted,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });
  // @TODO: add tests to cover failing scenarios
});
