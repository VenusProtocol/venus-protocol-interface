import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { ChainId } from 'types';

import { act, fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { useGetVTokenBalance, useWithdraw } from 'clients/api';
import { en } from 'libs/translations';
import Withdraw from '..';
import {
  fakeAsset,
  fakePool,
  fakeVTokenBalanceMantissa,
  fakeWethAsset,
} from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

describe('WithdrawForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'wrapUnwrapNativeToken',
    );
  });

  it('renders without crashing', () => {
    renderComponent(<Withdraw asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
  });

  it('does not display the receive native token toggle if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Withdraw asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeNull();
  });

  it('displays the receive native token toggle if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Withdraw asset={fakeWethAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeVisible();
  });

  it('lets the user partially withdraw directly to native tokens by unwrapping', async () => {
    const mockWithdraw = vi.fn();
    (useWithdraw as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdraw,
    }));

    const onCloseMock = vi.fn();
    const { getByText, getByTestId } = renderComponent(
      <Withdraw asset={fakeWethAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    // receive native token is active by default, so no need to click on it

    // Enter amount in input
    const correctAmountTokens = 1;

    act(() => {
      fireEvent.change(getByTestId(TEST_IDS.valueInput), {
        target: { value: correctAmountTokens },
      });
    });
    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.withdraw));
    act(() => {
      fireEvent.click(getByText(en.operationForm.submitButtonLabel.withdraw));
    });

    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledTimes(1));
    expect(mockWithdraw.mock.calls[0]).toMatchSnapshot();

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('lets the user withdraw all their tokens directly to native tokens by unwrapping', async () => {
    const mockWithdraw = vi.fn();
    (useWithdraw as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdraw,
    }));

    // simulate a pool where the user can withdraw all their supplied tokens
    const fakePoolWithLiquidity = {
      ...fakePool,
      userBorrowBalanceCents: new BigNumber(0),
    };
    // simulate the total amount of VTokens the user has and will be redeemed
    (useGetVTokenBalance as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeVTokenBalanceMantissa,
      },
    }));
    const onCloseMock = vi.fn();
    const { getByText } = renderComponent(
      <Withdraw asset={fakeWethAsset} pool={fakePoolWithLiquidity} onSubmitSuccess={onCloseMock} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    // receive native token is active by default, so no need to click on it

    // click on MAX button
    act(() => {
      fireEvent.click(getByText(en.operationForm.safeMaxButtonLabel));
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.withdraw));
    act(() => {
      fireEvent.click(getByText(en.operationForm.submitButtonLabel.withdraw));
    });

    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledTimes(1));
    expect(mockWithdraw.mock.calls[0]).toMatchSnapshot();

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
