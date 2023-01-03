import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Asset } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { getAllowance, useGetAsset, useGetMainAssets } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import { VBEP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import SupplyWithdraw from '.';

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

describe('hooks/useSupplyWithdrawModal', () => {
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
        assets: assetData,
        userTotalBorrowLimitCents: fakeUserTotalBorrowLimitDollars,
        userTotalBorrowBalanceCents: fakeUserTotalBorrowBalanceDollars,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(() => <SupplyWithdraw onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />);
  });

  it('asks the user to connect if wallet is not connected', async () => {
    const { getByText } = renderComponent(() => (
      <SupplyWithdraw onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />
    ));

    const connectTextSupply = getByText(en.supplyWithdraw.connectWalletToSupply);
    expect(connectTextSupply).toHaveTextContent(en.supplyWithdraw.connectWalletToSupply);
    const withdrawButton = getByText(en.supplyWithdraw.withdraw);
    fireEvent.click(withdrawButton);
    const connectTextWithdraw = getByText(en.supplyWithdraw.connectWalletToWithdraw);
    expect(connectTextWithdraw).toHaveTextContent(en.supplyWithdraw.connectWalletToWithdraw);
  });

  it('submit is disabled with no amount', async () => {
    const { getByText } = renderComponent(
      () => <SupplyWithdraw onClose={jest.fn()} vToken={VBEP_TOKENS.sxp} />,
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
});
