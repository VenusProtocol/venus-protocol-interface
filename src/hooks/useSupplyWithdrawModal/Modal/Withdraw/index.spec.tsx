import { act, fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { Pool } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { getVTokenBalanceOf, redeem, redeemUnderlying, useGetPool } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Withdraw from '.';
import TEST_IDS from './testIds';

const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: 10,
  userBorrowLimitCents: 1000,
};

const fakeAsset = fakePool.assets[0];
fakeAsset.userSupplyBalanceTokens = new BigNumber(1000);
fakeAsset.userWalletBalanceTokens = new BigNumber(10000000);
fakeAsset.tokenPriceDollars = new BigNumber(1);

const fakeVTokenBalanceWei = new BigNumber(10000000);

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useSupplyWithdrawModal/Withdraw', () => {
  beforeEach(() => {
    (getVTokenBalanceOf as jest.Mock).mockImplementation(() => ({
      balanceWei: fakeVTokenBalanceWei,
    }));

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: fakePool,
      },
      isLoading: false,
    }));
  });

  it('submit is disabled with no amount', async () => {
    const { getByText } = renderComponent(
      () => (
        <Withdraw
          onClose={jest.fn()}
          vToken={fakeAsset.vToken}
          poolComptrollerAddress={fakePool.comptrollerAddress}
        />
      ),
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() =>
      getByText(en.supplyWithdraw.withdraw.submitButton.enterValidAmountWithdrawLabel),
    );

    const disabledButtonText = getByText(
      en.supplyWithdraw.withdraw.submitButton.enterValidAmountWithdrawLabel,
    );
    expect(disabledButtonText).toHaveTextContent(
      en.supplyWithdraw.withdraw.submitButton.enterValidAmountWithdrawLabel,
    );
    const disabledButton = document.querySelector('button[type="submit"]');
    expect(disabledButton).toBeDisabled();
  });

  it('displays correct token withdrawable amount', async () => {
    const { getByText } = renderComponent(
      () => (
        <Withdraw
          onClose={jest.fn()}
          vToken={fakeAsset.vToken}
          poolComptrollerAddress={fakePool.comptrollerAddress}
        />
      ),
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText('19.8 XVS'));
  });

  it('redeem is called when full amount is withdrawn', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.isCollateralOfUser = false;

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByText } = renderComponent(
      () => (
        <Withdraw
          onClose={jest.fn()}
          vToken={customFakeAsset.vToken}
          poolComptrollerAddress={customFakePool.comptrollerAddress}
        />
      ),
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    const maxButton = await waitFor(() => getByText(en.supplyWithdraw.withdraw.max.toUpperCase()));
    act(() => {
      fireEvent.click(maxButton);
    });
    const submitButton = await waitFor(
      () => document.querySelector('button[type="submit"]') as HTMLButtonElement,
    );

    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.supplyWithdraw.withdraw.submitButton.enabledLabel),
    );
    fireEvent.click(submitButton);

    await waitFor(() => expect(redeem).toHaveBeenCalledWith({ amountWei: fakeVTokenBalanceWei }));
  });

  it('redeemUnderlying is called when partial amount is withdrawn', async () => {
    const { getByTestId } = renderComponent(
      () => (
        <Withdraw
          onClose={jest.fn()}
          vToken={fakeAsset.vToken}
          poolComptrollerAddress={fakePool.comptrollerAddress}
        />
      ),
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    const correctAmountTokens = 1;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });
    });
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton).toHaveTextContent(en.supplyWithdraw.withdraw.submitButton.enabledLabel);
    fireEvent.click(submitButton);

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(redeemUnderlying).toHaveBeenCalledWith({ amountWei: expectedAmountWei }),
    );
  });
});
