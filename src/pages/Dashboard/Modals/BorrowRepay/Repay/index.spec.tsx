import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { Asset } from 'types';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useUserMarketInfo, repayNonBnbVToken } from 'clients/api';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import Repay, { PRESET_PERCENTAGES } from '.';

const fakeAsset: Asset = {
  ...assetData[0],
  tokenPrice: new BigNumber(1),
  borrowBalance: new BigNumber(1000),
  walletBalance: new BigNumber(10000000),
};

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('pages/Dashboard/BorrowRepayModal/Repay', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: [],
      userTotalBorrowLimit: new BigNumber(1000),
      userTotalBorrowBalance: new BigNumber(100),
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} onClose={noop} isXvsEnabled />);
  });

  it('displays correct token borrow balance', async () => {
    const { getByText } = renderComponent(<Repay asset={fakeAsset} onClose={noop} isXvsEnabled />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() => getByText(`1,000 ${fakeAsset.symbol.toUpperCase()}`));
  });

  it('displays correct token wallet balance', async () => {
    const { getByText } = renderComponent(<Repay asset={fakeAsset} onClose={noop} isXvsEnabled />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() => getByText(`10,000,000 ${fakeAsset.symbol.toUpperCase()}`));
  });

  it('disables submit button if an amount entered in input is higher than token borrow balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      walletBalance: new BigNumber(1),
    };

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} onClose={noop} isXvsEnabled />,
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

    const incorrectValueTokens = customFakeAsset.walletBalance.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), {
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
      <Repay asset={fakeAsset} onClose={noop} isXvsEnabled />,
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

    const incorrectValueTokens = fakeAsset.borrowBalance.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), {
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
      borrowBalance: new BigNumber(100),
      walletBalance: new BigNumber(10),
    };

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} onClose={noop} isXvsEnabled />,
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
    const input = getByTestId('token-text-field') as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    const expectedInputValue = customFakeAsset.walletBalance.dp(customFakeAsset.decimals).toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(getByText(en.borrowRepayModal.repay.submitButton).closest('button')).toBeEnabled();
  });

  it('updates input value to token borrow balance when pressing on max button if token borrow balance is lower than token wallet balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      borrowBalance: new BigNumber(10),
      walletBalance: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} onClose={noop} isXvsEnabled />,
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
    const input = getByTestId('token-text-field') as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    const expectedInputValue = customFakeAsset.borrowBalance.dp(customFakeAsset.decimals).toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(getByText(en.borrowRepayModal.repay.submitButton).closest('button')).toBeEnabled();
  });

  it('updates input value to correct value when pressing on preset percentage buttons', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      borrowBalance: new BigNumber(100),
      walletBalance: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} onClose={noop} isXvsEnabled />,
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
    const input = getByTestId('token-text-field') as HTMLInputElement;
    expect(input.value).toBe('');

    for (let i = 0; i < PRESET_PERCENTAGES.length; i++) {
      const presetPercentage = PRESET_PERCENTAGES[i];

      // Press on preset percentage button
      fireEvent.click(getByText(`${presetPercentage}%`));

      const expectedInputValue = customFakeAsset.borrowBalance
        .multipliedBy(presetPercentage / 100)
        .dp(customFakeAsset.decimals)
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

    (repayNonBnbVToken as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} onClose={onCloseMock} isXvsEnabled />,
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
    fireEvent.change(getByTestId('token-text-field'), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.repay.submitButton));

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
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
