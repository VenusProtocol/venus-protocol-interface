import { act, fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import React from 'react';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { getVTokenBalanceOf, redeem, redeemUnderlying } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Withdraw from '..';
import { fakeAsset, fakePool, fakeVTokenBalanceWei } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('clients/api');
vi.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useSupplyWithdrawModal/Withdraw', () => {
  it('submit button is disabled with no amount', async () => {
    renderComponent(() => <Withdraw onCloseModal={noop} asset={fakeAsset} pool={fakePool} />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(
        en.operationModal.withdraw.submitButtonLabel.enterValidAmount,
      ),
    );
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled when entering a value higher than the withdrawable amount', async () => {
    const { getByTestId } = renderComponent(
      () => <Withdraw onCloseModal={noop} asset={fakeAsset} pool={fakePool} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    const incorrectAmountTokens = 10000000000000;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: incorrectAmountTokens } });
    });

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(
        en.operationModal.withdraw.submitButtonLabel.higherThanWithdrawableAmount,
      ),
    );
    expect(submitButton).toBeDisabled();
  });

  it('displays correct token withdrawable amount', async () => {
    const { getByText } = renderComponent(
      () => <Withdraw onCloseModal={noop} asset={fakeAsset} pool={fakePool} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText('19.80 XVS'));
  });

  it('redeem is called when full amount is withdrawn', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.isCollateralOfUser = false;

    (getVTokenBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceWei: fakeVTokenBalanceWei,
    }));

    const { getByText } = renderComponent(
      () => <Withdraw onCloseModal={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    const maxButton = await waitFor(() =>
      getByText(en.operationModal.withdraw.rightMaxButtonLabel.toUpperCase()),
    );
    act(() => {
      fireEvent.click(maxButton);
    });
    const submitButton = await waitFor(
      () => document.querySelector('button[type="submit"]') as HTMLButtonElement,
    );

    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationModal.withdraw.submitButtonLabel.withdraw),
    );
    fireEvent.click(submitButton);

    await waitFor(() => expect(redeem).toHaveBeenCalledWith({ amountWei: fakeVTokenBalanceWei }));
  });

  it('redeemUnderlying is called when partial amount is withdrawn', async () => {
    const { getByTestId } = renderComponent(
      () => <Withdraw onCloseModal={noop} asset={fakeAsset} pool={fakePool} />,
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
    expect(submitButton).toHaveTextContent(en.operationModal.withdraw.submitButtonLabel.withdraw);
    fireEvent.click(submitButton);

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(redeemUnderlying).toHaveBeenCalledWith({ amountWei: expectedAmountWei }),
    );
  });
});
