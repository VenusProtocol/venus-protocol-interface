import React from 'react';
import BigNumber from 'bignumber.js';
import { act, fireEvent, waitFor } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import { AuthContext } from 'context/AuthContext';
import {
  supplyNonBnb,
  supplyBnb,
  redeem,
  redeemUnderlying,
  getVTokenBalance,
  useUserMarketInfo,
} from 'clients/api';
import { Asset, TokenId } from 'types';
import en from 'translation/translations/en.json';
import SupplyWithdraw from '.';

const ONE = '1';
const ONE_WEI = '1000000000000000000';
const fakeGetVTokenBalance = new BigNumber('111');

const fakeAsset: Asset = {
  ...assetData[0],
  tokenPrice: new BigNumber(1),
  supplyBalance: new BigNumber(1000),
  walletBalance: new BigNumber(10000000),
};
const fakeAssets = [fakeAsset];

const fakeUserTotalBorrowLimitDollars = new BigNumber(1000);
const fakeUserTotalBorrowBalanceDollars = new BigNumber(10);

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('pages/Dashboard/SupplyWithdrawUi', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: [], // Not used in these tests
      userTotalBorrowLimit: fakeUserTotalBorrowLimitDollars,
      userTotalBorrowBalance: fakeUserTotalBorrowBalanceDollars,
    }));
  });

  describe('Supply form', () => {
    it('renders without crashing', async () => {
      renderComponent(
        <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={fakeAssets} />,
      );
    });

    it.only('displays correct token wallet balance', async () => {
      const { getByText } = renderComponent(
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
          <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={fakeAssets} />
        </AuthContext.Provider>,
      );

      await waitFor(() => getByText(`10,000,000 ${fakeAsset.symbol.toUpperCase()}`));
    });

    it('asks the user to connect if wallet is not connected', async () => {
      const { getByText } = renderComponent(
        <AuthContext.Provider
          value={{
            login: jest.fn(),
            logOut: jest.fn(),
            openAuthModal: jest.fn(),
            closeAuthModal: jest.fn(),
            account: undefined,
          }}
        >
          <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={fakeAssets} />
        </AuthContext.Provider>,
      );

      const connectTextSupply = getByText(en.supplyWithdraw.connectWalletToSupply);
      expect(connectTextSupply).toHaveTextContent(en.supplyWithdraw.connectWalletToSupply);
      const withdrawButton = getByText(en.supplyWithdraw.withdraw);
      fireEvent.click(withdrawButton);
      const connectTextWithdraw = getByText(en.supplyWithdraw.connectWalletToWithdraw);
      expect(connectTextWithdraw).toHaveTextContent(en.supplyWithdraw.connectWalletToWithdraw);
    });

    it('submit is disabled with no amount', async () => {
      const { getByText } = renderComponent(
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
          <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={fakeAssets} />
        </AuthContext.Provider>,
      );

      const disabledButtonText = getByText(en.supplyWithdraw.enterValidAmountSupply);
      expect(disabledButtonText).toHaveTextContent(en.supplyWithdraw.enterValidAmountSupply);
      const disabledButton = document.querySelector('button[type="submit"]');
      expect(disabledButton).toHaveAttribute('disabled');
    });

    it('calls supplyBnb when supplying BNB', async () => {
      const bnbAsset = {
        ...fakeAsset,
        id: 'bnb' as TokenId,
        symbol: 'BNB',
        vsymbol: 'vBNB',
        walletBalance: new BigNumber('11'),
      };
      renderComponent(
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
          <SupplyWithdraw onClose={jest.fn()} asset={bnbAsset} isXvsEnabled assets={fakeAssets} />
        </AuthContext.Provider>,
      );
      const tokenTextInput = document.querySelector('input') as HTMLInputElement;
      act(() => {
        fireEvent.change(tokenTextInput, { target: { value: ONE } });
      });
      const sumbitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(sumbitButton).toHaveTextContent(en.supplyWithdraw.supply);
      fireEvent.click(sumbitButton);
      await waitFor(() => expect(supplyBnb).toHaveBeenCalledWith({ amount: ONE_WEI }));
    });

    it('calls supplyNonBnb when supplying other token', async () => {
      const nonBnbAsset = {
        ...fakeAsset,
        id: 'eth' as TokenId,
        symbol: 'ETH',
        vsymbol: 'vETH',
        walletBalance: new BigNumber('11'),
      };
      renderComponent(
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
          <SupplyWithdraw
            onClose={jest.fn()}
            asset={nonBnbAsset}
            isXvsEnabled
            assets={fakeAssets}
          />
        </AuthContext.Provider>,
      );
      const tokenTextInput = document.querySelector('input') as HTMLInputElement;
      act(() => {
        fireEvent.change(tokenTextInput, { target: { value: ONE } });
      });
      const sumbitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(sumbitButton).toHaveTextContent(en.supplyWithdraw.supply);
      fireEvent.click(sumbitButton);
      await waitFor(() => expect(supplyNonBnb).toHaveBeenCalledWith({ amount: ONE_WEI }));
    });
  });

  describe('Withdraw form', () => {
    it('redeem is called when full amount is withdrawn', async () => {
      (getVTokenBalance as jest.Mock).mockImplementationOnce(async () => fakeGetVTokenBalance);
      const { getByText } = renderComponent(
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
          <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={fakeAssets} />
        </AuthContext.Provider>,
      );

      const withdrawButton = await waitFor(() => getByText(en.supplyWithdraw.withdraw));
      fireEvent.click(withdrawButton);
      const maxButton = await waitFor(() => getByText(en.supplyWithdraw.max.toUpperCase()));
      act(() => {
        fireEvent.click(maxButton);
      });
      const sumbitButton = await waitFor(
        () => document.querySelector('button[type="submit"]') as HTMLButtonElement,
      );
      await waitFor(() => expect(sumbitButton).toHaveTextContent(en.supplyWithdraw.withdraw));
      fireEvent.click(sumbitButton);
      await waitFor(() => expect(redeem).toHaveBeenCalledWith({ amount: fakeGetVTokenBalance }));
    });

    it('redeemUnderlying is called when partial amount is withdrawn', async () => {
      const { getByText } = renderComponent(
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
          <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={fakeAssets} />
        </AuthContext.Provider>,
      );
      const withdrawButton = getByText(en.supplyWithdraw.withdraw);
      fireEvent.click(withdrawButton);
      const tokenTextInput = document.querySelector('input') as HTMLInputElement;
      act(() => {
        fireEvent.change(tokenTextInput, { target: { value: ONE } });
      });
      const sumbitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(sumbitButton).toHaveTextContent(en.supplyWithdraw.withdraw);
      fireEvent.click(sumbitButton);
      await waitFor(() => expect(redeemUnderlying).toHaveBeenCalledWith({ amount: ONE_WEI }));
    });
  });
});
