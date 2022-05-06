import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import fakeAccountAddress from '__mocks__/models/address';
import { useUserMarketInfo, borrowVToken } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import Borrow from '.';

const ONE = '1';
const fakeAsset: Asset = {
  key: 0,
  id: 'sxp',
  img: '/static/media/sxp.78951004.png',
  vimg: '/static/media/vsxp.b4a90bb0.png',
  symbol: 'SXP',
  tokenAddress: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
  vsymbol: 'vSXP',
  vtokenAddress: '0x2ff3d0f6990a40261c66e1ff2017acbc282eb6d0',
  supplyApy: new BigNumber('0.05225450324405023'),
  borrowApy: new BigNumber('-2.3062487835658776'),
  xvsSupplyApy: new BigNumber('0.11720675342484096'),
  xvsBorrowApy: new BigNumber('4.17469243006608279'),
  collateralFactor: new BigNumber('0.5'),
  borrowCaps: new BigNumber('0'),
  totalBorrows: new BigNumber('1852935.597521220541385584'),
  treasuryBalance: new BigNumber('0'),
  supplyBalance: new BigNumber('90'),
  borrowBalance: new BigNumber('0'),
  isEnabled: true,
  collateral: false,
  percentOfLimit: '0',
  hypotheticalLiquidity: ['0', '0', '0'],
  decimals: 18,
  tokenPrice: new BigNumber(1),
  walletBalance: new BigNumber(10000000),
  liquidity: new BigNumber(10000),
};

const fakeUserTotalBorrowLimitDollars = new BigNumber(1000);
const fakeUserTotalBorrowBalanceDollars = new BigNumber(10);
const fakeBorrowDeltaDollars = fakeUserTotalBorrowLimitDollars.minus(
  fakeUserTotalBorrowBalanceDollars,
);

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('pages/Dashboard/BorrowRepayModal/Borrow', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: [], // Not used in these tests
      userTotalBorrowLimit: fakeUserTotalBorrowLimitDollars,
      userTotalBorrowBalance: fakeUserTotalBorrowBalanceDollars,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Borrow asset={fakeAsset} onClose={noop} isXvsEnabled />);
  });

  // TODO: fix form (currently allows borrowing more than available liquidity)
  it.skip('disables submit button if an amount entered in input is higher than asset liquidity', async () => {
    const customFakeAssets: Asset = {
      ...fakeAsset,
      walletBalance: new BigNumber(10000000),
    };

    const { getByText, getByTestId } = renderComponent(
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
        <Borrow asset={customFakeAssets} onClose={noop} isXvsEnabled />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');

    const fakeIncorrectAmount = customFakeAssets.liquidity
      .dividedBy(customFakeAssets.tokenPrice)
      // Add one token more than the available liquidity
      .plus(1)
      .dp(customFakeAssets.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), { target: { value: fakeIncorrectAmount } });

    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');
  });

  it('disables submit button if amount to borrow requested would make user borrow balance go higher than their borrow limit', async () => {
    const { getByText, getByTestId } = renderComponent(
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
        <Borrow asset={fakeAsset} onClose={noop} isXvsEnabled />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');

    const fakeIncorrectAmount = fakeBorrowDeltaDollars
      .dividedBy(fakeAsset.tokenPrice)
      // Add one token more than the maximum
      .plus(1)
      .dp(fakeAsset.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), { target: { value: fakeIncorrectAmount } });

    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));
    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');
  });

  it('updates input value correctly when pressing on max button', async () => {
    const { getByText, getByTestId } = renderComponent(
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
        <Borrow asset={fakeAsset} onClose={noop} isXvsEnabled />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    // Check input is empty
    const input = getByTestId('token-text-field') as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(`${SAFE_BORROW_LIMIT_PERCENTAGE}% LIMIT`));

    const safeUserBorrowLimitDollars = fakeUserTotalBorrowLimitDollars
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE)
      .dividedBy(100);
    const safeBorrowDeltaDollars = safeUserBorrowLimitDollars.minus(
      fakeUserTotalBorrowBalanceDollars,
    );
    const safeBorrowDeltaTokens = safeBorrowDeltaDollars.dividedBy(fakeAsset.tokenPrice);
    const expectedInputValue = safeBorrowDeltaTokens.dp(fakeAsset.decimals).toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));
  });

  it('lets user borrow tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (borrowVToken as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByText, getByTestId } = renderComponent(
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
        <Borrow asset={fakeAsset} onClose={onCloseMock} isXvsEnabled />
      </AuthContext.Provider>,
    );
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButtonDisabled));

    expect(
      getByText(en.borrowRepayModal.borrow.submitButtonDisabled).closest('button'),
    ).toHaveAttribute('disabled');

    // Enter amount in input
    fireEvent.change(getByTestId('token-text-field'), { target: { value: ONE } });

    // Click on submit button
    await waitFor(() => getByText(en.borrowRepayModal.borrow.submitButton));
    fireEvent.click(getByText(en.borrowRepayModal.borrow.submitButton));

    const expectedAmountWei = new BigNumber(ONE).multipliedBy(
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
      message: expect.any(String),
      title: expect.any(String),
    });
  });
});
