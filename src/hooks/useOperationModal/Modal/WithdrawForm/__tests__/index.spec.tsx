import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { getVTokenBalanceOf, redeem, redeemUnderlying } from 'clients/api';
import { en } from 'packages/translations';
import { Asset, Pool } from 'types';

import Withdraw from '..';
import { fakeAsset, fakePool, fakeVTokenBalanceMantissa } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

describe('WithdrawForm', () => {
  it('submit button is disabled with no amount', async () => {
    renderComponent(<Withdraw onCloseModal={noop} asset={fakeAsset} pool={fakePool} />, {
      accountAddress: fakeAccountAddress,
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
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowBalanceCents: new BigNumber(0),
      userBorrowLimitCents: new BigNumber(10000000000),
    };

    const customFakeAsset: Asset = {
      ...fakeAsset,
      tokenPriceCents: new BigNumber(1),
      liquidityCents: new BigNumber(60),
      userSupplyBalanceTokens: new BigNumber(100),
    };

    const { getByTestId } = renderComponent(
      <Withdraw onCloseModal={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectAmountTokens = 90;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: incorrectAmountTokens } });
    });

    // Check warning is displayed
    await waitFor(() => getByTestId(TEST_IDS.notice));
    expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
      '"Insufficient asset liquidity"',
    );

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
      <Withdraw onCloseModal={noop} asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('19.80 XVS'));
  });

  it('redeem is called when full amount is withdrawn', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.isCollateralOfUser = false;

    (getVTokenBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceMantissa: fakeVTokenBalanceMantissa,
    }));

    const { getByText } = renderComponent(
      <Withdraw onCloseModal={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const maxButton = await waitFor(() =>
      getByText(en.operationModal.withdraw.rightMaxButtonLabel.toUpperCase()),
    );
    fireEvent.click(maxButton);

    const submitButton = await waitFor(
      () => document.querySelector('button[type="submit"]') as HTMLButtonElement,
    );

    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationModal.withdraw.submitButtonLabel.withdraw),
    );
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(redeem).toHaveBeenCalledWith({ amountMantissa: fakeVTokenBalanceMantissa }),
    );
  });

  it('redeemUnderlying is called when partial amount is withdrawn', async () => {
    const { getByTestId } = renderComponent(
      <Withdraw onCloseModal={noop} asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
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

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(redeemUnderlying).toHaveBeenCalledWith({ amountMantissa: expectedAmountMantissa }),
    );
  });
});
