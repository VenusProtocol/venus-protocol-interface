import { act, fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';
import { convertTokensToWei } from 'utilities';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { getAllowance, redeem, redeemUnderlying, useGetAsset, useGetMainAssets } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import { VBEP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Withdraw from '.';
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

describe('Withdraw form', () => {
  beforeEach(() => {
    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: fakeAsset,
      },
    }));
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

  it('submit is disabled with no amount', async () => {
    const { getByText } = renderComponent(
      () => <Withdraw onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() => getByText(en.supplyWithdraw.enterValidAmountWithdraw));

    const disabledButtonText = getByText(en.supplyWithdraw.enterValidAmountWithdraw);
    expect(disabledButtonText).toHaveTextContent(en.supplyWithdraw.enterValidAmountWithdraw);
    const disabledButton = document.querySelector('button[type="submit"]');
    expect(disabledButton).toBeDisabled();
  });

  it('displays correct token withdrawable amount', async () => {
    const { getByText } = renderComponent(
      () => <Withdraw onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() => getByText('19.8 SXP'));
  });

  it('redeem is called when full amount is withdrawn', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      isCollateralOfUser: false,
    };

    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));

    const { getByText } = renderComponent(
      () => <Withdraw onClose={jest.fn()} vToken={customFakeAsset.vToken} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    const maxButton = await waitFor(() => getByText(en.supplyWithdraw.max.toUpperCase()));
    act(() => {
      fireEvent.click(maxButton);
    });
    const submitButton = await waitFor(
      () => document.querySelector('button[type="submit"]') as HTMLButtonElement,
    );

    await waitFor(() => expect(submitButton).toHaveTextContent(en.supplyWithdraw.withdraw));
    fireEvent.click(submitButton);

    const expectedAmountWei = convertTokensToWei({
      value: customFakeAsset.userSupplyBalanceTokens,
      token: customFakeAsset.vToken.underlyingToken,
    });
    await waitFor(() => expect(redeem).toHaveBeenCalledWith({ amountWei: expectedAmountWei }));
  });

  it('redeemUnderlying is called when partial amount is withdrawn', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
    };

    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: customFakeAsset,
      },
    }));
    const { getByTestId } = renderComponent(
      () => <Withdraw onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />,
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
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton).toHaveTextContent(en.supplyWithdraw.withdraw);
    fireEvent.click(submitButton);

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(redeemUnderlying).toHaveBeenCalledWith({ amountWei: expectedAmountWei }),
    );
  });
});
