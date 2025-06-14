import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { useRepay } from 'clients/api';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';

import { chainMetadata } from '@venusprotocol/chains';
import { ChainId } from 'types';
import Repay, { PRESET_PERCENTAGES } from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('hooks/useTokenApproval');

const checkSubmitButtonIsDisabled = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() =>
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
  );
  expect(submitButton).toBeDisabled();
};

const checkSubmitButtonIsEnabled = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() =>
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.repay),
  );
  expect(submitButton).toBeEnabled();
};

const mockRepay = vi.fn();

describe('RepayForm', () => {
  beforeEach(() => {
    (useRepay as Mock).mockImplementation(() => ({
      mutateAsync: mockRepay,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />);
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Repay onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();
  });

  it('displays correct wallet amount', async () => {
    const { getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('10M XVS'));
  });

  it('disables submit button if amount entered in input is higher than user repay balance', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(1);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(100);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    const incorrectValueTokens = customFakeAsset.userBorrowBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanRepayBalance)).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount entered in input is higher than wallet balance', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(100);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(1);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    const incorrectValueTokens = customFakeAsset.userWalletBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.higherThanWalletBalance.replace(
            '{{tokenSymbol}}',
            customFakeAsset.vToken.underlyingToken.symbol,
          ),
        ),
      ).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button and displays error notice if token has been approved but amount entered is higher than wallet spending limit', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: fakeAsset.vToken.underlyingToken,
      spenderAddress: fakeAsset.vToken.address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);

    (useTokenApproval as Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByText, getByTestId } = renderComponent(
      <Repay onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    const incorrectValueTokens = fakeWalletSpendingLimitTokens
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanWalletSpendingLimit)).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Repay onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
        accountChainId: ChainId.ARBITRUM_ONE,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const correctAmountTokens = 1;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Check "Switch chain" button is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.switchChain.switchButton.replace(
            '{{chainName}}',
            chainMetadata[ChainId.BSC_TESTNET].name,
          ),
        ),
      ).toBeInTheDocument(),
    );
  });

  it('displays the wallet spending limit correctly and lets user revoke it', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: xvs,
      spenderAddress: vXvs.address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId } = renderComponent(
      <Repay onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check spending limit is correctly displayed
    await waitFor(() => getByTestId(TEST_IDS.spendingLimit));
    expect(getByTestId(TEST_IDS.spendingLimit).textContent).toMatchSnapshot();

    // Press on revoke button
    const revokeSpendingLimitButton = within(getByTestId(TEST_IDS.spendingLimit)).getByRole(
      'button',
    );

    fireEvent.click(revokeSpendingLimitButton);

    await waitFor(() => expect(fakeRevokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('enables repaying the full loan when clicking on MAX button if wallet balance is high enough', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );

    // Check input is empty
    expect(tokenTextInput.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    const expectedInputValue = fakeAsset.userBorrowBalanceTokens.toFixed();

    await waitFor(() => expect(tokenTextInput.value).toBe(expectedInputValue));

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled();
  });

  it('updates input value to wallet balance when clicking on MAX button if user borrow balance is higher than wallet balance', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(100);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(10);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );

    // Check input is empty
    expect(tokenTextInput.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    const expectedInputValue = customFakeAsset.userWalletBalanceTokens.toFixed();

    await waitFor(() => expect(tokenTextInput.value).toBe(expectedInputValue));

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled();
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

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );

    // Check input is empty
    expect(tokenTextInput.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    const expectedInputValue = fakeWalletSpendingLimitTokens.toFixed();

    await waitFor(() => expect(tokenTextInput.value).toBe(expectedInputValue));

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled();
  });

  it('updates input value to correct value when clicking on preset percentage buttons', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(100);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(100);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );

    // Check input is empty
    expect(tokenTextInput.value).toBe('');

    for (let i = 0; i < PRESET_PERCENTAGES.length; i++) {
      // Clear input
      fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
        target: { value: '' },
      });

      const presetPercentage = PRESET_PERCENTAGES[i];

      // Press on preset percentage button
      fireEvent.click(getByText(`${presetPercentage}%`));

      const expectedInputValue = customFakeAsset.userBorrowBalanceTokens
        .multipliedBy(presetPercentage / 100)
        .dp(customFakeAsset.vToken.underlyingToken.decimals)
        .toFixed();

      await waitFor(() => expect(tokenTextInput.value).toBe(expectedInputValue));

      // Check submit button is enabled
      await checkSubmitButtonIsEnabled();
    }
  });

  it('lets user repay borrowed tokens then calls onClose callback on success', async () => {
    const onCloseMock = vi.fn();

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );

    const correctAmountTokens = 1;

    // Enter amount in input
    fireEvent.change(tokenTextInput, {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    await waitFor(() => expect(mockRepay).toHaveBeenCalledTimes(1));
    expect(mockRepay.mock.calls[0]).toMatchSnapshot();

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('lets user repay full loan', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement);

    // Click on 100% button
    fireEvent.click(getByText('100%'));

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    await waitFor(() => expect(mockRepay).toHaveBeenCalledTimes(1));
    expect(mockRepay.mock.calls[0]).toMatchSnapshot();
  });
});
