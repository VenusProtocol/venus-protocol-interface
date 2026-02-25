import { fireEvent, waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { eth } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useGetBalanceOf, useRepay } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { type Asset, ChainId } from 'types';

import useGetSwapInfo from 'hooks/useGetSwapInfo';
import { checkSubmitButtonIsEnabled } from 'pages/Market/OperationForm/__testUtils__/checkFns';
import RepayWithWalletBalanceForm from '..';
import { fakeAsset, fakePool, fakeWethAsset } from '../../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('hooks/useGetSwapInfo');

const fakeBalanceMantissa = new BigNumber('10000000000000000000');

const mockRepay = vi.fn();

describe('RepayWithWalletBalanceForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useRepay as Mock).mockImplementation(() => ({
      mutateAsync: mockRepay,
    }));

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'wrapUnwrapNativeToken',
    );

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: undefined,
      error: undefined,
      isLoading: false,
    }));

    (useGetBalanceOf as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeBalanceMantissa,
      },
      isLoading: false,
    }));

    (useSimulateBalanceMutations as Mock).mockImplementation(({ pool }) => ({
      isLoading: false,
      data: { pool },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
      },
    );
  });

  it('does not display the token selector if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('displays the token selector if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeWethAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible();
  });

  it('enables repaying the full loan when clicking on MAX button if wallet balance is high enough', async () => {
    const customFakeWethAsset: Asset = {
      ...fakeWethAsset,
      userBorrowBalanceTokens: new BigNumber(100),
    };

    // Add 1 WETH to simulate wallet balance being higher than borrow balance
    const fakeUserWethWalletBalance = customFakeWethAsset.userBorrowBalanceTokens.plus(1);
    const fakeHigherNativeTokenBalance = fakeBalanceMantissa.plus(1);
    const fakeHigherUserWalletNativeTokenBalanceData = fakeHigherNativeTokenBalance.multipliedBy(
      10 ** customFakeWethAsset.vToken.underlyingToken.tokenWrapped!.decimals,
    );

    (useGetBalanceOf as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeUserWethWalletBalance.multipliedBy(
          10 ** customFakeWethAsset.vToken.underlyingToken.decimals,
        ),
      },
      isLoading: false,
    }));

    const { container, getByText, getByTestId, queryByTestId } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={customFakeWethAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeHigherUserWalletNativeTokenBalanceData}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: eth,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(
        customFakeWethAsset.userBorrowBalanceTokens.toFixed(),
      ),
    );

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('updates input value to wallet balance when clicking on MAX button if user borrow balance is higher than wallet balance', async () => {
    const customFakeWethAsset: Asset = {
      ...fakeWethAsset,
      userBorrowBalanceTokens: new BigNumber(100),
    };

    // Remove 1 WETH to simulate wallet balance being lower than borrow balance
    const fakeUserWethWalletBalance = customFakeWethAsset.userBorrowBalanceTokens.minus(1);
    const fakeLowerNativeTokenBalance = fakeUserWethWalletBalance;
    const fakeLowerUserWalletNativeTokenBalanceData = fakeLowerNativeTokenBalance.multipliedBy(
      10 ** customFakeWethAsset.vToken.underlyingToken.tokenWrapped!.decimals,
    );

    (useGetBalanceOf as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeUserWethWalletBalance.multipliedBy(
          10 ** customFakeWethAsset.vToken.underlyingToken.decimals,
        ),
      },
      isLoading: false,
    }));

    const { container, getByText, getByTestId, queryByTestId } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={customFakeWethAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeLowerUserWalletNativeTokenBalanceData}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: eth,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(fakeUserWethWalletBalance.toFixed()),
    );

    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('updates input value to wallet balance when clicking on MAX button if user borrow balance is higher than wallet spending limit', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: fakeAsset.vToken.underlyingToken,
      spenderAddress: fakeAsset.vToken.address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { container, getByText, getByTestId, queryByTestId } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeWethAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: eth,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(fakeWalletSpendingLimitTokens.toFixed()),
    );

    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('lets user wrap and repay, then calls onClose callback on success', async () => {
    const amountTokensToRepay = new BigNumber('1');

    const onCloseMock = vi.fn();
    const { container, getByTestId, queryByTestId, getByText } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeWethAsset}
        pool={fakePool}
        onSubmitSuccess={onCloseMock}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible();

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: eth,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: amountTokensToRepay.toString() } });

    // Click on submit button
    const submitButton = await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeEnabled());
    await waitFor(() => expect(mockRepay).toHaveBeenCalledTimes(1));
    expect(mockRepay.mock.calls[0]).toMatchSnapshot();

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
