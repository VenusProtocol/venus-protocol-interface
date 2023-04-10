import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { Pool, VToken } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { poolData } from '__mocks__/models/pools';
import { supply, useGetPool } from 'clients/api';
import { DISABLED_TOKENS } from 'constants/disabledTokens';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Supply from '.';
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

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('Supply form', () => {
  beforeEach(() => {
    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: fakePool,
      },
      isLoading: false,
    }));
  });

  it.each(DISABLED_TOKENS)('does not display supply tab when asset is %s', async token => {
    const fakeVToken: VToken = {
      ...TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'], // This doesn't matter, only the underlying token is used
      underlyingToken: token,
    };

    const { queryByText } = renderComponent(
      () => (
        <Supply
          onClose={jest.fn()}
          vToken={fakeVToken}
          poolComptrollerAddress={fakePool.comptrollerAddress}
        />
      ),
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => expect(queryByText(en.supplyWithdraw.supplyTabTitle)).toBeNull());
  });

  it('displays correct token wallet balance', async () => {
    const { getByText } = renderComponent(
      <Supply
        onClose={jest.fn()}
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
      />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() =>
      getByText(`10,000,000 ${fakeAsset.vToken.underlyingToken.symbol.toUpperCase()}`),
    );
  });

  it('displays correct token supply balance', async () => {
    const { getByText } = renderComponent(
      () => (
        <Supply
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

    await waitFor(() => getByText('1,000'));
  });

  it('displays warning notice if asset is from an isolated pool', async () => {
    const customFakePool = _cloneDeep(fakePool);
    customFakePool.isIsolated = true;

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByTestId } = renderComponent(
      <Supply
        onClose={jest.fn()}
        vToken={fakeAsset.vToken}
        poolComptrollerAddress={fakePool.comptrollerAddress}
      />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.noticeIsolatedAsset));
    expect(getByTestId(TEST_IDS.noticeIsolatedAsset).textContent).toMatchInlineSnapshot(
      '"This is an isolated token. Supplying XVS to the Venus pool will enable you to borrow tokens from this pool exclusively.Show tokens from the Venus pool"',
    );
  });

  it('disables submit button if an amount entered in input is higher than token wallet balance', async () => {
    const { getByText } = renderComponent(
      () => (
        <Supply
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
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel),
    );

    // Check submit button is disabled
    expect(
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel).closest(
        'button',
      ),
    ).toBeDisabled();

    const incorrectValueTokens = fakeAsset.userWalletBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    const tokenTextInput = document.querySelector('input') as HTMLInputElement;
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is still disabled
    await waitFor(() =>
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel),
    );
    expect(
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel).closest(
        'button',
      ),
    ).toBeDisabled();
  });

  it('disables form and displays a warning notice if the supply cap of this market has been reached', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.supplyCapTokens = new BigNumber(100);
    customFakeAsset.supplyBalanceTokens = new BigNumber(100);

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(
      () => (
        <Supply
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

    // Check warning is displayed
    await waitFor(() => getByTestId(TEST_IDS.noticeError));
    expect(getByTestId(TEST_IDS.noticeError).textContent).toMatchInlineSnapshot(
      '"The supply cap of 100 XVS has been reached for this pool. You can not supply to this market anymore until withdraws are made or its supply cap is increased."',
    );

    // Check submit button is disabled
    expect(
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel).closest(
        'button',
      ),
    ).toBeDisabled();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.valueInput).closest('input')).toBeDisabled();
  });

  it('disables submit button and displays error notice if an amount entered in input is higher than asset supply cap', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.supplyCapTokens = new BigNumber(100);
    customFakeAsset.supplyBalanceTokens = new BigNumber(10);

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(
      () => (
        <Supply
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
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel),
    );

    // Check submit button is disabled
    expect(
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel).closest(
        'button',
      ),
    ).toBeDisabled();

    const incorrectValueTokens = customFakeAsset.supplyCapTokens
      .minus(customFakeAsset.supplyBalanceTokens)
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = document.querySelector('input') as HTMLInputElement;
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error notice is displayed
    await waitFor(() => expect(getByTestId(TEST_IDS.noticeError)));
    expect(getByTestId(TEST_IDS.noticeError).textContent).toMatchInlineSnapshot(
      '"You can not supply more than 90 XVS to this pool, as the supply cap for this market is set at 100 XVS and 10 XVS are currently being supplied to it."',
    );

    // Check submit button is still disabled
    await waitFor(() =>
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel),
    );
    expect(
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel).closest(
        'button',
      ),
    ).toBeDisabled();
  });

  it('submit is disabled with no amount', async () => {
    const { getByText } = renderComponent(
      () => (
        <Supply
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
      getByText(en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel),
    );

    const disabledButtonText = getByText(
      en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel,
    );
    expect(disabledButtonText).toHaveTextContent(
      en.supplyWithdraw.supply.submitButton.enterValidAmountSupplyLabel,
    );
    const disabledButton = document.querySelector('button[type="submit"]');
    expect(disabledButton).toBeDisabled();
  });

  it('lets user supply BNB, then displays successful transaction modal and calls onClose callback on success', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.vToken = TESTNET_VBEP_TOKENS['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'];

    (useGetPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: customFakePool,
      },
      isLoading: false,
    }));

    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (supply as jest.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    renderComponent(
      () => (
        <Supply
          onClose={onCloseMock}
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

    const correctAmountTokens = customFakeAsset.userWalletBalanceTokens.minus(1);
    const tokenTextInput = document.querySelector('input') as HTMLInputElement;
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.supplyWithdraw.supply.submitButton.enabledLabel),
    );
    fireEvent.click(submitButton);

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(customFakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(supply).toHaveBeenCalledWith({ amountWei: expectedAmountWei }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
        transactionHash: fakeContractReceipt.transactionHash,
        amount: {
          token: customFakeAsset.vToken.underlyingToken,
          valueWei: expectedAmountWei,
        },
        content: en.supplyWithdraw.supply.successfulSupplyTransactionModal.message,
        title: en.supplyWithdraw.supply.successfulSupplyTransactionModal.title,
      }),
    );
  });

  it('lets user supply non-BNB tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (supply as jest.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByTestId } = renderComponent(
      () => (
        <Supply
          onClose={onCloseMock}
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

    const correctAmountTokens = fakeAsset.userWalletBalanceTokens.minus(1);
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.supplyWithdraw.supply.submitButton.enabledLabel),
    );
    fireEvent.click(submitButton);

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(supply).toHaveBeenCalledWith({ amountWei: expectedAmountWei }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
        transactionHash: fakeContractReceipt.transactionHash,
        amount: {
          token: fakeAsset.vToken.underlyingToken,
          valueWei: expectedAmountWei,
        },
        content: en.supplyWithdraw.supply.successfulSupplyTransactionModal.message,
        title: en.supplyWithdraw.supply.successfulSupplyTransactionModal.title,
      }),
    );
  });
});
