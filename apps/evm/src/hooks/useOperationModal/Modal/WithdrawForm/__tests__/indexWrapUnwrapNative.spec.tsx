import noop from 'noop-ts';
import type Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { ChainId } from 'types';

import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { redeemAndUnwrap, redeemUnderlyingAndUnwrap, useGetVTokenBalanceOf } from 'clients/api';
import { en } from 'libs/translations';
import Withdraw from '..';
import { fakeAsset, fakePool, fakeWethAsset } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('libs/tokens');
vi.mock('hooks/useGetNativeWrappedTokenUserBalances');

describe('WithdrawForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'wrapUnwrapNativeToken',
    );
  });

  it('renders without crashing', () => {
    renderComponent(<Withdraw asset={fakeAsset} pool={fakePool} onCloseModal={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
  });

  it('does not display the receive native token toggle if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Withdraw asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeNull();
  });

  it('displays the receive native token toggle if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Withdraw asset={fakeWethAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeVisible();
  });

  it('lets the user partially withdraw directly to native tokens by unwrapping', async () => {
    const onCloseMock = vi.fn();
    const { getByText, getByTestId, getByRole } = renderComponent(
      <Withdraw asset={fakeWethAsset} pool={fakePool} onCloseModal={onCloseMock} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    // click on receive native token
    const receiveNativeTokenSwitch = getByRole('checkbox');
    fireEvent.click(receiveNativeTokenSwitch);

    // Enter amount in input
    const correctAmountTokens = 1;
    fireEvent.change(getByTestId(TEST_IDS.valueInput), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationModal.withdraw.submitButtonLabel.withdraw));
    fireEvent.click(getByText(en.operationModal.withdraw.submitButtonLabel.withdraw));

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(redeemUnderlyingAndUnwrap).toHaveBeenCalledTimes(1));
    expect(redeemUnderlyingAndUnwrap).toHaveBeenCalledWith({
      amountMantissa: expectedAmountMantissa,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('lets the user withdraw all their tokens directly to native tokens by unwrapping', async () => {
    // simulate a pool where the user can withdraw all their supplied tokens
    const fakePoolWithLiquidity = {
      ...fakePool,
      userBorrowBalanceCents: new BigNumber(0),
    };
    // simulate the total amount of VTokens the user has and will be redeemed
    const fakeVTokenBalanceMantissa = new BigNumber(1234);
    (useGetVTokenBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeVTokenBalanceMantissa,
      },
    }));
    const onCloseMock = vi.fn();
    const { getByText, getByRole } = renderComponent(
      <Withdraw asset={fakeWethAsset} pool={fakePoolWithLiquidity} onCloseModal={onCloseMock} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    // click on receive native token
    const receiveNativeTokenSwitch = getByRole('checkbox');
    fireEvent.click(receiveNativeTokenSwitch);

    // click on MAX button
    fireEvent.click(getByText(en.operationModal.withdraw.rightMaxButtonLabel));

    // Click on submit button
    await waitFor(() => getByText(en.operationModal.withdraw.submitButtonLabel.withdraw));
    fireEvent.click(getByText(en.operationModal.withdraw.submitButtonLabel.withdraw));

    await waitFor(() => expect(redeemAndUnwrap).toHaveBeenCalledTimes(1));
    expect(redeemAndUnwrap).toHaveBeenCalledWith({
      amountMantissa: fakeVTokenBalanceMantissa,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
