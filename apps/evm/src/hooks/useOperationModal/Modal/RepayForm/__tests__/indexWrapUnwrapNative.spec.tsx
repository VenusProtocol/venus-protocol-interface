import { fireEvent, waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { eth } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useGetBalanceOf, wrapTokensAndRepay } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { type Asset, ChainId } from 'types';
import { convertTokensToMantissa } from 'utilities';

import Repay from '..';
import { fakeAsset, fakePool, fakeWethAsset } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('libs/tokens');
vi.mock('hooks/useGetNativeWrappedTokenUserBalances');

const fakeBalanceMantissa = new BigNumber('10000000000000000000');

describe('RepayForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'wrapUnwrapNativeToken',
    );
    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeBalanceMantissa,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
  });

  it('does not display the token selector if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('displays the token selector if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Repay asset={fakeWethAsset} pool={fakePool} onCloseModal={noop} />,
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

    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeUserWethWalletBalance.multipliedBy(
          10 ** customFakeWethAsset.vToken.underlyingToken.decimals,
        ),
      },
      isLoading: false,
    }));

    const { container, getByText, getByTestId, queryByTestId } = renderComponent(
      <Repay asset={customFakeWethAsset} pool={fakePool} onCloseModal={noop} />,
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
    fireEvent.click(getByText(en.operationModal.repay.rightMaxButtonLabel));

    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(
        customFakeWethAsset.userBorrowBalanceTokens.toFixed(),
      ),
    );

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.operationModal.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    // Check submit button is enabled
    expect(
      getByText(en.operationModal.repay.submitButtonLabel.repay).closest('button'),
    ).toBeEnabled();
  });

  it('updates input value to wallet balance when clicking on MAX button if user borrow balance is higher than wallet balance', async () => {
    const customFakeWethAsset: Asset = {
      ...fakeWethAsset,
      userBorrowBalanceTokens: new BigNumber(100),
    };

    // Remove 1 WETH to simulate wallet balance being lower than borrow balance
    const fakeUserWethWalletBalance = customFakeWethAsset.userBorrowBalanceTokens.minus(1);

    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeUserWethWalletBalance.multipliedBy(
          10 ** customFakeWethAsset.vToken.underlyingToken.decimals,
        ),
      },
      isLoading: false,
    }));

    const { container, getByText, getByTestId, queryByTestId } = renderComponent(
      <Repay asset={customFakeWethAsset} pool={fakePool} onCloseModal={noop} />,
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
    fireEvent.click(getByText(en.operationModal.repay.rightMaxButtonLabel));

    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(fakeUserWethWalletBalance.toFixed()),
    );

    // Check submit button is enabled
    expect(
      getByText(en.operationModal.repay.submitButtonLabel.repay).closest('button'),
    ).toBeEnabled();
  });

  it('updates input value to wallet balance when clicking on MAX button if user borrow balance is higher than wallet spending limit', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: fakeAsset.vToken.underlyingToken,
      spenderAddress: fakeAsset.vToken.address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { container, getByText, getByTestId, queryByTestId } = renderComponent(
      <Repay asset={fakeWethAsset} pool={fakePool} onCloseModal={noop} />,
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
    fireEvent.click(getByText(en.operationModal.repay.rightMaxButtonLabel));

    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(fakeWalletSpendingLimitTokens.toFixed()),
    );

    // Check submit button is enabled
    expect(
      getByText(en.operationModal.repay.submitButtonLabel.repay).closest('button'),
    ).toBeEnabled();
  });

  it('lets user wrap and repay, then calls onClose callback on success', async () => {
    const amountTokensToRepay = new BigNumber('1');
    const amountMantissaToRepay = convertTokensToMantissa({
      value: amountTokensToRepay,
      token: eth,
    });

    const onCloseMock = vi.fn();
    const { container, getByTestId, queryByTestId, getByText } = renderComponent(
      <Repay asset={fakeWethAsset} pool={fakePool} onCloseModal={onCloseMock} />,
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

    const expectedSubmitButtonLabel = en.operationModal.repay.submitButtonLabel.repay;

    // Click on submit button
    const submitButton = await waitFor(() => getByText(expectedSubmitButtonLabel));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(wrapTokensAndRepay).toHaveBeenCalledTimes(1));
    expect(wrapTokensAndRepay).toHaveBeenCalledWith({
      amountMantissa: amountMantissaToRepay,
    });

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
