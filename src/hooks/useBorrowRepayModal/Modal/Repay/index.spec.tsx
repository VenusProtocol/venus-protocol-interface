import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { Asset } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { getAllowance, repay, useGetUserAsset, useGetUserMarketInfo } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Repay, { PRESET_PERCENTAGES } from '.';
import TEST_IDS from './testIds';

const fakeAsset: Asset = {
  ...assetData[0],
  tokenPriceDollars: new BigNumber(1),
  userBorrowBalanceTokens: new BigNumber(1000),
  userWalletBalanceTokens: new BigNumber(10000000),
};

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useBorrowRepayModal/Repay', () => {
  beforeEach(() => {
    (useGetUserAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: fakeAsset,
      },
    }));

    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => ({
      allowanceWei: MAX_UINT256,
    }));

    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [],
        userTotalBorrowLimitCents: new BigNumber(100000),
        userTotalBorrowBalanceCents: new BigNumber(10000),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Repay vToken={fakeAsset.vToken} onClose={noop} />);
  });

  it('displays correct token borrow balance', async () => {
    const { getByText } = renderComponent(<Repay vToken={fakeAsset.vToken} onClose={noop} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() =>
      getByText(`1,000 ${fakeAsset.vToken.underlyingToken.symbol.toUpperCase()}`),
    );
  });

  it('displays correct token wallet balance', async () => {
    const { getByText } = renderComponent(<Repay vToken={fakeAsset.vToken} onClose={noop} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() =>
      getByText(`10,000,000 ${fakeAsset.vToken.underlyingToken.symbol.toUpperCase()}`),
    );
  });

  it('disables submit button if an amount entered in input is higher than token borrow balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userWalletBalanceTokens: new BigNumber(1),
    };

    (useGetUserAsset as jest.Mock).mockImplementationOnce(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    const { getByText, getByTestId } = renderComponent(
      <Repay vToken={customFakeAsset.vToken} onClose={noop} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = customFakeAsset.userWalletBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is disabled
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toBeDisabled();
  });

  it('disables submit button if an amount entered in input is higher than token wallet balance', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Repay vToken={fakeAsset.vToken} onClose={noop} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = fakeAsset.userBorrowBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is disabled
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toBeDisabled();
  });

  it('updates input value to token wallet balance when pressing on max button if token wallet balance is lower than token borrow balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userBorrowBalanceTokens: new BigNumber(100),
      userWalletBalanceTokens: new BigNumber(10),
    };

    (useGetUserAsset as jest.Mock).mockImplementationOnce(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    const { getByText, getByTestId } = renderComponent(
      <Repay vToken={customFakeAsset.vToken} onClose={noop} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    // Check input is empty
    const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    const expectedInputValue = customFakeAsset.userWalletBalanceTokens
      .dp(customFakeAsset.vToken.underlyingToken.decimals)
      .toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(getByText(en.borrowRepayModal.repay.submitButton).closest('button')).toBeEnabled();
  });

  it('updates input value to token borrow balance when pressing on max button if token borrow balance is lower than token wallet balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userBorrowBalanceTokens: new BigNumber(10),
      userWalletBalanceTokens: new BigNumber(100),
    };

    (useGetUserAsset as jest.Mock).mockImplementationOnce(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    const { getByText, getByTestId } = renderComponent(
      <Repay vToken={customFakeAsset.vToken} onClose={noop} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    // Check input is empty
    const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    const expectedInputValue = customFakeAsset.userBorrowBalanceTokens
      .dp(customFakeAsset.vToken.underlyingToken.decimals)
      .toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(getByText(en.borrowRepayModal.repay.submitButton).closest('button')).toBeEnabled();
  });

  it('updates input value to correct value when pressing on preset percentage buttons', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userBorrowBalanceTokens: new BigNumber(100),
      userWalletBalanceTokens: new BigNumber(100),
    };

    (useGetUserAsset as jest.Mock).mockImplementationOnce(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    const { getByText, getByTestId } = renderComponent(
      <Repay vToken={customFakeAsset.vToken} onClose={noop} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    // Check input is empty
    const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

    for (let i = 0; i < PRESET_PERCENTAGES.length; i++) {
      const presetPercentage = PRESET_PERCENTAGES[i];

      // Press on preset percentage button
      fireEvent.click(getByText(`${presetPercentage}%`));

      const expectedInputValue = customFakeAsset.userBorrowBalanceTokens
        .multipliedBy(presetPercentage / 100)
        .dp(customFakeAsset.vToken.underlyingToken.decimals)
        .toFixed();

      // eslint-disable-next-line
      await waitFor(() => expect(input.value).toBe(expectedInputValue));

      // Check submit button is enabled
      expect(
        getByText(en.borrowRepayModal.repay.submitButton).closest('button'),
      ).not.toBeDisabled();
    }
  });

  it('lets user repay borrowed tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repay as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByText, getByTestId } = renderComponent(
      <Repay vToken={fakeAsset.vToken} onClose={onCloseMock} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toBeDisabled();

    const correctAmountTokens = 1;

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.repay.submitButton));

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(repay).toHaveBeenCalledTimes(1));
    expect(repay).toHaveBeenCalledWith({
      amountWei: expectedAmountWei,
      accountAddress: fakeAccountAddress,
      isRepayingFullLoan: false,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      amount: {
        token: fakeAsset.vToken.underlyingToken,
        valueWei: expectedAmountWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it('lets user repay full loan', async () => {
    (repay as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByText } = renderComponent(<Repay vToken={fakeAsset.vToken} onClose={jest.fn()} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.repay.submitButtonDisabled).closest('button'),
    ).toBeDisabled();

    // Press on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.borrowRepayModal.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.repay.submitButton));

    await waitFor(() => expect(repay).toHaveBeenCalledTimes(1));
    expect(repay).toHaveBeenCalledWith({
      amountWei: fakeAsset.userBorrowBalanceTokens.multipliedBy(1e18), // Convert borrow balance to wei
      accountAddress: fakeAccountAddress,
      isRepayingFullLoan: true,
    });
  });
});
