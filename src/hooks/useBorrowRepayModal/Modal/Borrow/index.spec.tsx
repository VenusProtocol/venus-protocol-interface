import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import React from 'react';
import { Pool } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { poolData } from '__mocks__/models/pools';
import { borrow, getAllowance, useGetPool } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Borrow from '.';
import TEST_IDS from './testIds';

const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: 1000,
  userBorrowLimitCents: 100000,
};

const fakeAsset = fakePool.assets[0];
fakeAsset.liquidityCents = 1000000;
fakeAsset.userWalletBalanceTokens = new BigNumber(10000000);
fakeAsset.tokenPriceDollars = new BigNumber(1);

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useBorrowRepayModal/Borrow', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => ({
      allowanceWei: MAX_UINT256,
    }));

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: fakePool,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(
      <Borrow
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
        onClose={noop}
      />,
    );
  });

  it('renders correct token borrowable amount when asset liquidity is higher than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.liquidityCents = 100000000;

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByText } = renderComponent(
      <Borrow
        vToken={customFakeAsset.vToken}
        poolComptrollerAddress={customFakePool.comptrollerAddress}
        onClose={noop}
      />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    const borrowDeltaDollars =
      (fakePool.userBorrowLimitCents! - fakePool.userBorrowBalanceCents!) / 100;
    const borrowDeltaTokens = new BigNumber(borrowDeltaDollars).dividedBy(
      fakeAsset.tokenPriceDollars,
    );

    await waitFor(() =>
      getByText(`${borrowDeltaTokens.toFixed()} ${customFakeAsset.vToken.underlyingToken.symbol}`),
    );
  });

  it('renders correct token borrowable amount when asset liquidity is lower than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.liquidityCents = 200;

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByText } = renderComponent(
      <Borrow
        vToken={customFakeAsset.vToken}
        poolComptrollerAddress={customFakePool.comptrollerAddress}
        onClose={noop}
      />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() =>
      getByText(
        `${customFakeAsset.liquidityCents / 100} ${customFakeAsset.vToken.underlyingToken.symbol}`,
      ),
    );
  });

  it('displays warning message and disables form if user has not supplied and collateralize any tokens yet', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowLimitCents: 0,
      userBorrowBalanceCents: 0,
      assets: fakePool.assets.map(asset => ({
        ...asset,
        isCollateralOfUser: false,
      })),
    };

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(
      <Borrow
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={customFakePool.comptrollerAddress}
        onClose={noop}
      />,
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

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();

    // Check warning is displayed
    expect(
      getByText(
        en.borrowRepayModal.borrow.noCollateralizedSuppliedAssetWarning.replace(
          '{{tokenSymbol}}',
          fakeAsset.vToken.underlyingToken.symbol,
        ),
      ),
    ).toBeTruthy();
  });

  it('disables submit button if an amount entered in input is higher than asset liquidity', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.liquidityCents = 200;

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(
      <Borrow
        vToken={customFakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
        onClose={noop}
      />,
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

    const incorrectValueTokens = new BigNumber(customFakeAsset.liquidityCents)
      // Convert to dollars
      .dividedBy(100)
      .dividedBy(customFakeAsset.tokenPriceDollars)
      // Add one token more than the available liquidity
      .plus(1)
      .dp(customFakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toBeDisabled();
  });

  it('disables submit button if amount to borrow requested would make user borrow balance go higher than their borrow limit', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Borrow
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
        onClose={noop}
      />,
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

    const fakeBorrowDeltaDollars =
      (fakePool.userBorrowLimitCents! - fakePool.userBorrowBalanceCents!) / 100;

    const incorrectValueTokens = new BigNumber(fakeBorrowDeltaDollars)
      .dividedBy(fakeAsset.tokenPriceDollars)
      // Add one token more than the maximum
      .plus(1)
      .dp(fakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
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
      <Borrow
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
        onClose={noop}
      />,
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
    const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(`${SAFE_BORROW_LIMIT_PERCENTAGE}% LIMIT`));

    const safeUserBorrowLimitCents = new BigNumber(fakePool.userBorrowLimitCents!)
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE)
      .dividedBy(100);
    const safeBorrowDeltaDollars = safeUserBorrowLimitCents
      .minus(fakePool.userBorrowBalanceCents!)
      .dividedBy(100);
    const safeBorrowDeltaTokens = safeBorrowDeltaDollars.dividedBy(fakeAsset.tokenPriceDollars);
    const expectedInputValue = safeBorrowDeltaTokens
      .dp(fakeAsset.vToken.underlyingToken.decimals)
      .toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(getByText(en.borrowRepayModal.borrow.submitButton).closest('button')).toBeEnabled();
  });

  it('lets user borrow tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (borrow as jest.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText, getByTestId } = renderComponent(
      <Borrow
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
        onClose={onCloseMock}
      />,
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
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.borrow.submitButton));

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(borrow).toHaveBeenCalledTimes(1));
    expect(borrow).toHaveBeenCalledWith({
      amountWei: expectedAmountWei,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: fakeAsset.vToken.underlyingToken,
        valueWei: expectedAmountWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });
});
