import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { assetData } from '__mocks__/models/asset';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import TEST_IDS from 'constants/testIds';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import fakeAccountAddress from '__mocks__/models/address';
import { useGetUserMarketInfo, borrowVToken, getAllowance } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import Borrow from '.';

const fakeAsset: Asset = {
  ...assetData[0],
  tokenPrice: new BigNumber(1),
  walletBalance: new BigNumber(10000000),
  liquidity: new BigNumber(10000),
};

const fakeUserTotalBorrowLimitCents = new BigNumber(100000);
const fakeUserTotalBorrowBalanceCents = new BigNumber(1000);

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('pages/Dashboard/BorrowRepayModal/Borrow', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => MAX_UINT256);
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [], // Not used in these tests
        userTotalBorrowLimitCents: fakeUserTotalBorrowLimitCents,
        userTotalBorrowBalanceCents: fakeUserTotalBorrowBalanceCents,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Borrow asset={fakeAsset} onClose={noop} isXvsEnabled />);
  });

  it('renders correct token borrowable amount when asset liquidity is higher than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidity: new BigNumber(100000000),
    };

    const { getByText } = renderComponent(
      <Borrow asset={customFakeAsset} onClose={noop} isXvsEnabled />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    const borrowDeltaDollars = fakeUserTotalBorrowLimitCents
      .minus(fakeUserTotalBorrowBalanceCents)
      .dividedBy(100);
    const borrowDeltaTokens = borrowDeltaDollars.dividedBy(fakeAsset.tokenPrice);

    await waitFor(() => getByText(`${borrowDeltaTokens.toFixed()} ${customFakeAsset.symbol}`));
  });

  it('renders correct token borrowable amount when asset liquidity is lower than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidity: new BigNumber(200),
    };

    const { getByText } = renderComponent(
      <Borrow asset={customFakeAsset} onClose={noop} isXvsEnabled />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() =>
      getByText(`${customFakeAsset.liquidity.toFixed()} ${customFakeAsset.symbol}`),
    );
  });

  it('disables submit button if an amount entered in input is higher than asset liquidity', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidity: new BigNumber(200),
    };

    const { getByText, getByTestId } = renderComponent(
      <Borrow asset={customFakeAsset} onClose={noop} isXvsEnabled />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = customFakeAsset.liquidity
      .dividedBy(customFakeAsset.tokenPrice)
      // Add one token more than the available liquidity
      .plus(1)
      .dp(customFakeAsset.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.borrowModal.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toBeDisabled();
  });

  it('disables submit button if amount to borrow requested would make user borrow balance go higher than their borrow limit', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Borrow asset={fakeAsset} onClose={noop} isXvsEnabled />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    // Check submit button is disabled
    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toBeDisabled();

    const fakeBorrowDeltaDollars = fakeUserTotalBorrowLimitCents
      .minus(fakeUserTotalBorrowBalanceCents)
      .dividedBy(100);

    const incorrectValueTokens = fakeBorrowDeltaDollars
      .dividedBy(fakeAsset.tokenPrice)
      // Add one token more than the maximum
      .plus(1)
      .dp(fakeAsset.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.borrowModal.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is still disabled
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toBeDisabled();
  });

  it('updates input value correctly when pressing on max button', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Borrow asset={fakeAsset} onClose={noop} isXvsEnabled />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    // Check input is empty
    const input = getByTestId(TEST_IDS.borrowModal.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(`${SAFE_BORROW_LIMIT_PERCENTAGE}% LIMIT`));

    const safeUserBorrowLimitCents = fakeUserTotalBorrowLimitCents
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE)
      .dividedBy(100);
    const safeBorrowDeltaDollars = safeUserBorrowLimitCents
      .minus(fakeUserTotalBorrowBalanceCents)
      .dividedBy(100);
    const safeBorrowDeltaTokens = safeBorrowDeltaDollars.dividedBy(fakeAsset.tokenPrice);
    const expectedInputValue = safeBorrowDeltaTokens.dp(fakeAsset.decimals).toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(getByText(en.borrowRepayModal.borrow.submitButton).closest('button')).toBeEnabled();
  });

  it('lets user borrow tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (borrowVToken as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByText, getByTestId } = renderComponent(
      <Borrow asset={fakeAsset} onClose={onCloseMock} isXvsEnabled />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toBeDisabled();

    // Enter amount in input
    const correctAmountTokens = 1;
    fireEvent.change(getByTestId(TEST_IDS.borrowModal.tokenTextField), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.borrow.submitButton));

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.decimals),
    );

    await waitFor(() => expect(borrowVToken).toHaveBeenCalledTimes(1));
    expect(borrowVToken).toHaveBeenCalledWith({
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
      content: expect.any(String),
      title: expect.any(String),
    });
  });
});
