import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import type Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { getVTokenBalanceOf, withdraw } from 'clients/api';
import { en } from 'libs/translations';
import type { Asset, Pool } from 'types';

import Withdraw from '../';
import { fakeAsset, fakePool, fakeVTokenBalanceMantissa } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

describe('WithdrawForm', () => {
  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Withdraw onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.operationForm.connectWalletButtonLabel)).toBeInTheDocument();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.valueInput).closest('input')).toBeDisabled();
  });

  it('submit button is disabled with no amount', async () => {
    renderComponent(<Withdraw onSubmitSuccess={noop} asset={fakeAsset} pool={fakePool} />, {
      accountAddress: fakeAccountAddress,
    });

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
    );
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled when entering a value higher than the available liquidity', async () => {
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

    const { getByTestId, getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={customFakeAsset} pool={customFakePool} />,
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
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableLiquidity)).toBeInTheDocument(),
    );

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
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
      liquidityCents: new BigNumber(60000),
      userSupplyBalanceTokens: new BigNumber(100),
    };

    const { getByTestId, getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectAmountTokens = 110;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: incorrectAmountTokens } });
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanWithdrawableAmount)).toBeInTheDocument(),
    );

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
    );
    expect(submitButton).toBeDisabled();
  });

  it('displays correct token withdrawable amount', async () => {
    const { getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('19.80 XVS'));
  });

  it('returns contract transaction when request to withdraw full supply succeeds', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.isCollateralOfUser = false;

    (getVTokenBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceMantissa: fakeVTokenBalanceMantissa,
    }));

    const { getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const maxButton = await waitFor(() =>
      getByText(en.operationForm.rightMaxButtonLabel.toUpperCase()),
    );
    fireEvent.click(maxButton);

    const submitButton = await waitFor(
      () => document.querySelector('button[type="submit"]') as HTMLButtonElement,
    );

    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.withdraw),
    );
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(withdraw).toHaveBeenCalledWith({
        amountMantissa: fakeVTokenBalanceMantissa,
        withdrawFullSupply: true,
        unwrap: false,
      }),
    );
  });

  it('returns contract transaction when request to withdraw partial supply succeeds', async () => {
    const { getByTestId } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={fakeAsset} pool={fakePool} />,
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
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.withdraw);
    fireEvent.click(submitButton);

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(withdraw).toHaveBeenCalledWith({
        amountMantissa: expectedAmountMantissa,
        withdrawFullSupply: false,
        unwrap: false,
      }),
    );
  });
});
