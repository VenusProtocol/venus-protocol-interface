import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Asset, VToken } from 'types';
import { DISABLED_TOKENS } from 'utilities';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { getAllowance, supply, useGetAsset, useGetMainAssets } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import { VBEP_TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Supply from '.';
import TEST_IDS from './testIds';

const fakeAsset: Asset = {
  ...assetData[0],
  tokenPriceDollars: new BigNumber(1),
  userSupplyBalanceTokens: new BigNumber(1000),
  userWalletBalanceTokens: new BigNumber(10000000),
};

const fakeUserTotalBorrowLimitDollars = new BigNumber(1000);
const fakeUserTotalBorrowBalanceDollars = new BigNumber(10);

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('Supply form', () => {
  beforeEach(() => {
    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: fakeAsset,
      },
    }));

    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => ({
      allowanceWei: MAX_UINT256,
    }));

    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [fakeAsset],
        userTotalBorrowLimitCents: fakeUserTotalBorrowLimitDollars,
        userTotalBorrowBalanceCents: fakeUserTotalBorrowBalanceDollars,
      },
      isLoading: false,
    }));
  });

  it.each(DISABLED_TOKENS)('does not display supply tab when asset is %s', async token => {
    const fakeVToken: VToken = {
      ...VBEP_TOKENS.xvs, // This doesn't matter, only the underlying token is used
      underlyingToken: token,
    };

    const customFakeAsset = {
      ...fakeAsset,
      vToken: fakeVToken,
      token,
    };

    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [customFakeAsset],
        userTotalBorrowLimitCents: fakeUserTotalBorrowLimitDollars,
        userTotalBorrowBalanceCents: fakeUserTotalBorrowBalanceDollars,
      },
      isLoading: false,
    }));

    const { queryByText } = renderComponent(
      () => <Supply onClose={jest.fn()} vToken={customFakeAsset.vToken} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() => expect(queryByText(en.supplyWithdraw.supply)).toBeNull());
  });

  it('displays correct token wallet balance', async () => {
    const { getByText } = renderComponent(<Supply onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />, {
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

  it('displays correct token supply balance', async () => {
    const { getByText } = renderComponent(
      () => <Supply onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() => getByText('1,000'));
  });

  it('disables submit button if an amount entered in input is higher than token wallet balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userWalletBalanceTokens: new BigNumber(1),
    };

    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [customFakeAsset],
        userTotalBorrowLimitCents: fakeUserTotalBorrowLimitDollars,
        userTotalBorrowBalanceCents: fakeUserTotalBorrowBalanceDollars,
      },
      isLoading: false,
    }));

    const { getByText } = renderComponent(
      () => <Supply onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    await waitFor(() => getByText(en.supplyWithdraw.enterValidAmountSupply));

    // Check submit button is disabled
    expect(getByText(en.supplyWithdraw.enterValidAmountSupply).closest('button')).toBeDisabled();

    const incorrectValueTokens = customFakeAsset.userWalletBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    const tokenTextInput = document.querySelector('input') as HTMLInputElement;
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is still disabled
    await waitFor(() => getByText(en.supplyWithdraw.enterValidAmountSupply));
    expect(getByText(en.supplyWithdraw.enterValidAmountSupply).closest('button')).toBeDisabled();
  });

  it('submit is disabled with no amount', async () => {
    const { getByText } = renderComponent(
      () => <Supply onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() => getByText(en.supplyWithdraw.enterValidAmountSupply));

    const disabledButtonText = getByText(en.supplyWithdraw.enterValidAmountSupply);
    expect(disabledButtonText).toHaveTextContent(en.supplyWithdraw.enterValidAmountSupply);
    const disabledButton = document.querySelector('button[type="submit"]');
    expect(disabledButton).toBeDisabled();
  });

  it('lets user supply BNB, then displays successful transaction modal and calls onClose callback on success', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: VBEP_TOKENS.bnb,
      userWalletBalanceTokens: new BigNumber('11'),
    };

    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [customFakeAsset],
        userTotalBorrowLimitCents: fakeUserTotalBorrowLimitDollars,
        userTotalBorrowBalanceCents: fakeUserTotalBorrowBalanceDollars,
      },
      isLoading: false,
    }));

    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (supply as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    renderComponent(() => <Supply onClose={onCloseMock} vToken={customFakeAsset.vToken} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    const correctAmountTokens = 1;
    const tokenTextInput = document.querySelector('input') as HTMLInputElement;
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toHaveTextContent(en.supplyWithdraw.supply));
    fireEvent.click(submitButton);

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(customFakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(supply).toHaveBeenCalledWith({ amountWei: expectedAmountWei }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
        transactionHash: fakeTransactionReceipt.transactionHash,
        amount: {
          token: customFakeAsset.vToken.underlyingToken,
          valueWei: expectedAmountWei,
        },
        content: en.supplyWithdraw.successfulSupplyTransactionModal.message,
        title: en.supplyWithdraw.successfulSupplyTransactionModal.title,
      }),
    );
  });

  it('lets user supply non-BNB tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: VBEP_TOKENS.busd,
      userWalletBalanceTokens: new BigNumber('11'),
    };

    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [customFakeAsset],
        userTotalBorrowLimitCents: fakeUserTotalBorrowLimitDollars,
        userTotalBorrowBalanceCents: fakeUserTotalBorrowBalanceDollars,
      },
      isLoading: false,
    }));

    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (supply as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByTestId } = renderComponent(
      () => <Supply onClose={onCloseMock} vToken={customFakeAsset.vToken} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    const correctAmountTokens = 1;
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toHaveTextContent(en.supplyWithdraw.supply));
    fireEvent.click(submitButton);

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(customFakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(supply).toHaveBeenCalledWith({ amountWei: expectedAmountWei }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
        transactionHash: fakeTransactionReceipt.transactionHash,
        amount: {
          token: customFakeAsset.vToken.underlyingToken,
          valueWei: expectedAmountWei,
        },
        content: en.supplyWithdraw.successfulSupplyTransactionModal.message,
        title: en.supplyWithdraw.successfulSupplyTransactionModal.title,
      }),
    );
  });
});
