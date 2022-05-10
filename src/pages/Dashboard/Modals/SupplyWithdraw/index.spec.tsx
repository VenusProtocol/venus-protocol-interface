import React from 'react';
import BigNumber from 'bignumber.js';
import { act, fireEvent, waitFor } from '@testing-library/react';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
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

const asset = assetData[1];
const fakeGetVTokenBalance = new BigNumber('111');

const fakeAsset: Asset = {
  ...assetData[0],
  tokenPrice: new BigNumber(1),
  supplyBalance: new BigNumber(1000),
  walletBalance: new BigNumber(10000000),
};

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

  it('renders without crashing', async () => {
    renderComponent(() => (
      <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />
    ));
  });

  it('asks the user to connect if wallet is not connected', async () => {
    const { getByText } = renderComponent(() => (
      <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={[fakeAsset]} />
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
      () => (
        <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={[fakeAsset]} />
      ),
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    const disabledButtonText = getByText(en.supplyWithdraw.enterValidAmountSupply);
    expect(disabledButtonText).toHaveTextContent(en.supplyWithdraw.enterValidAmountSupply);
    const disabledButton = document.querySelector('button[type="submit"]');
    expect(disabledButton).toBeDisabled();
  });

  describe('Supply form', () => {
    it('displays correct token wallet balance', async () => {
      const { getByText } = renderComponent(
        <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={[fakeAsset]} />,
        {
          authContextValue: {
            account: {
              address: fakeAccountAddress,
            },
          },
        },
      );

      await waitFor(() => getByText(`10,000,000 ${fakeAsset.symbol.toUpperCase()}`));
    });

    it('displays correct token supply balance', async () => {
      const { getByText } = renderComponent(
        () => (
          <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={[fakeAsset]} />
        ),
        {
          authContextValue: {
            account: {
              address: fakeAccountAddress,
            },
          },
        },
      );

      await waitFor(() => getByText(`1,000 ${fakeAsset.symbol.toUpperCase()}`));
    });

    it('disables submit button if an amount entered in input is higher than token wallet balance', async () => {
      const customFakeAsset: Asset = {
        ...fakeAsset,
        walletBalance: new BigNumber(1),
      };

      const { getByText } = renderComponent(
        () => (
          <SupplyWithdraw
            onClose={jest.fn()}
            asset={customFakeAsset}
            isXvsEnabled
            assets={[customFakeAsset]}
          />
        ),
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

      const incorrectValueTokens = customFakeAsset.walletBalance.plus(1).toFixed();

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
        () => (
          <SupplyWithdraw onClose={jest.fn()} asset={fakeAsset} isXvsEnabled assets={[fakeAsset]} />
        ),
        {
          authContextValue: {
            account: {
              address: fakeAccountAddress,
            },
          },
        },
      );

      const disabledButtonText = getByText(en.supplyWithdraw.enterValidAmountSupply);
      expect(disabledButtonText).toHaveTextContent(en.supplyWithdraw.enterValidAmountSupply);
      const disabledButton = document.querySelector('button[type="submit"]');
      expect(disabledButton).toBeDisabled();
    });

    it('lets user supply BNB, then displays successful transaction modal and calls onClose callback on success', async () => {
      const customFakeAsset: Asset = {
        ...fakeAsset,
        id: 'bnb' as TokenId,
        symbol: 'BNB',
        vsymbol: 'vBNB',
        walletBalance: new BigNumber('11'),
      };

      const onCloseMock = jest.fn();
      const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

      (supplyBnb as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

      renderComponent(
        () => (
          <SupplyWithdraw
            onClose={onCloseMock}
            asset={customFakeAsset}
            isXvsEnabled
            assets={[fakeAsset]}
          />
        ),
        {
          authContextValue: {
            account: {
              address: fakeAccountAddress,
            },
          },
        },
      );

      const correctAmountTokens = 1;
      const tokenTextInput = document.querySelector('input') as HTMLInputElement;
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

      // Click on submit button
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      await waitFor(() => expect(submitButton).toHaveTextContent(en.supplyWithdraw.supply));
      fireEvent.click(submitButton);

      const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
        new BigNumber(10).pow(customFakeAsset.decimals),
      );

      await waitFor(() => expect(supplyBnb).toHaveBeenCalledWith({ amountWei: expectedAmountWei }));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
          transactionHash: fakeTransactionReceipt.transactionHash,
          amount: {
            tokenId: customFakeAsset.id,
            valueWei: expectedAmountWei,
          },
          message: en.supplyWithdraw.successfulSupplyTransactionModal.message,
          title: en.supplyWithdraw.successfulSupplyTransactionModal.title,
        }),
      );
    });

    it('lets user supply non-BNB tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
      const customFakeAsset: Asset = {
        ...fakeAsset,
        id: 'eth' as TokenId,
        symbol: 'ETH',
        vsymbol: 'vETH',
        walletBalance: new BigNumber('11'),
      };

      const onCloseMock = jest.fn();
      const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

      (supplyNonBnb as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

      renderComponent(
        () => (
          <SupplyWithdraw
            onClose={onCloseMock}
            asset={customFakeAsset}
            isXvsEnabled
            assets={[fakeAsset]}
          />
        ),
        {
          authContextValue: {
            account: {
              address: fakeAccountAddress,
            },
          },
        },
      );

      const correctAmountTokens = 1;
      const tokenTextInput = document.querySelector('input') as HTMLInputElement;
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

      // Click on submit button
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      await waitFor(() => expect(submitButton).toHaveTextContent(en.supplyWithdraw.supply));
      fireEvent.click(submitButton);

      const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
        new BigNumber(10).pow(customFakeAsset.decimals),
      );

      await waitFor(() =>
        expect(supplyNonBnb).toHaveBeenCalledWith({ amountWei: expectedAmountWei }),
      );
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
          transactionHash: fakeTransactionReceipt.transactionHash,
          amount: {
            tokenId: customFakeAsset.id,
            valueWei: expectedAmountWei,
          },
          message: en.supplyWithdraw.successfulSupplyTransactionModal.message,
          title: en.supplyWithdraw.successfulSupplyTransactionModal.title,
        }),
      );
    });
  });

  describe('Withdraw form', () => {
    beforeEach(() => {
      (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
        assets: [], // Not used in these tests
        userTotalBorrowLimit: fakeUserTotalBorrowLimitDollars,
        userTotalBorrowBalance: fakeUserTotalBorrowBalanceDollars,
      }));
    });

    it('redeem is called when full amount is withdrawn', async () => {
      (getVTokenBalance as jest.Mock).mockImplementationOnce(async () => fakeGetVTokenBalance);
      const { getByText } = renderComponent(
        () => <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />,
        {
          authContextValue: {
            account: {
              address: fakeAccountAddress,
            },
          },
        },
      );

      const withdrawButton = await waitFor(() => getByText(en.supplyWithdraw.withdraw));
      fireEvent.click(withdrawButton);
      const maxButton = await waitFor(() => getByText(en.supplyWithdraw.max.toUpperCase()));
      act(() => {
        fireEvent.click(maxButton);
      });
      const submitButton = await waitFor(
        () => document.querySelector('button[type="submit"]') as HTMLButtonElement,
      );
      await waitFor(() => expect(submitButton).toHaveTextContent(en.supplyWithdraw.withdraw));
      fireEvent.click(submitButton);
      await waitFor(() => expect(redeem).toHaveBeenCalledWith({ amountWei: fakeGetVTokenBalance }));
    });

    it('redeemUnderlying is called when partial amount is withdrawn', async () => {
      const { getByText } = renderComponent(
        () => <SupplyWithdraw onClose={jest.fn()} asset={asset} isXvsEnabled assets={assetData} />,
        {
          authContextValue: {
            account: {
              address: fakeAccountAddress,
            },
          },
        },
      );
      const withdrawButton = getByText(en.supplyWithdraw.withdraw);
      fireEvent.click(withdrawButton);

      const correctAmountTokens = 1;

      const tokenTextInput = document.querySelector('input') as HTMLInputElement;
      act(() => {
        fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });
      });
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton).toHaveTextContent(en.supplyWithdraw.withdraw);
      fireEvent.click(submitButton);

      const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
        new BigNumber(10).pow(fakeAsset.decimals),
      );

      await waitFor(() =>
        expect(redeemUnderlying).toHaveBeenCalledWith({ amountWei: expectedAmountWei }),
      );
    });
  });
});
