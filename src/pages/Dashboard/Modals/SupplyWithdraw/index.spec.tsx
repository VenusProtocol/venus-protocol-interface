import React from 'react';
import BigNumber from 'bignumber.js';
import { act, fireEvent, waitFor } from '@testing-library/react';
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
import { TokenId } from 'types';
import en from 'translation/translations/en.json';
import SupplyWithdraw from '.';

const ONE = '1';
const ONE_WEI = '1000000000000000000';
const asset = assetData[1];
const fakeAccountAddress = '0x0';
const fakeGetVTokenBalance = new BigNumber('111');

jest.mock('clients/api');

describe('pages/Dashboard/SupplyWithdrawUi', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: assetData,
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(
      <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />,
    );
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
        <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />
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
        <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />
      </AuthContext.Provider>,
    );

    const disabledButtonText = getByText(en.supplyWithdraw.enterValidAmountSupply);
    expect(disabledButtonText).toHaveTextContent(en.supplyWithdraw.enterValidAmountSupply);
    const disabledButton = document.querySelector('button[type="submit"]');
    expect(disabledButton).toHaveAttribute('disabled');
  });

  it('calls supplyBnb when supplying BNB', async () => {
    const bnbAsset = {
      ...asset,
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
        <SupplyWithdraw onClose={jest.fn()} asset={bnbAsset} isXvsEnabled assets={assetData} />
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
      ...asset,
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
        <SupplyWithdraw onClose={jest.fn()} asset={nonBnbAsset} isXvsEnabled assets={assetData} />
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
        <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />
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
        <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />
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
