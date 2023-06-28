import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import React from 'react';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { repay } from 'clients/api';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Repay, { PRESET_PERCENTAGES } from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('clients/api');
vi.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useBorrowRepayModal/Repay', () => {
  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />);
  });

  it('displays correct borrow balance', async () => {
    const { getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText('1.00K XVS'));
  });

  it('displays correct wallet balance', async () => {
    const { getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText('10.00M XVS'));
  });

  it('disables submit button if amount entered in input is higher than user borrow balance', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(1);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(100);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = customFakeAsset.userBorrowBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is disabled
    await waitFor(() =>
      getByText(en.operationModal.repay.submitButtonLabel.amountHigherThanRepayBalance),
    );
    expect(
      getByText(en.operationModal.repay.submitButtonLabel.amountHigherThanRepayBalance).closest(
        'button',
      ),
    ).toBeDisabled();
  });

  it('disables submit button if amount entered in input is higher than wallet balance', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(100);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(1);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = customFakeAsset.userWalletBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is disabled
    const expectedSubmitButtonLabel =
      en.operationModal.repay.submitButtonLabel.insufficientWalletBalance.replace(
        '{{tokenSymbol}}',
        customFakeAsset.vToken.underlyingToken.symbol,
      );

    await waitFor(() => getByText(expectedSubmitButtonLabel));
    expect(getByText(expectedSubmitButtonLabel).closest('button')).toBeDisabled();
  });

  it('updates input value to wallet balance when pressing on max button', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(100);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(10);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount));

    // Check input is empty
    const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(en.operationModal.repay.rightMaxButtonLabel));

    const expectedInputValue = customFakeAsset.userWalletBalanceTokens.toFormat();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(
      getByText(en.operationModal.repay.submitButtonLabel.repay).closest('button'),
    ).toBeEnabled();
  });

  it('updates input value to correct value when pressing on preset percentage buttons', async () => {
    const customFakePool = _cloneDeep(fakePool);
    const customFakeAsset = customFakePool.assets[0];
    customFakeAsset.userBorrowBalanceTokens = new BigNumber(100);
    customFakeAsset.userWalletBalanceTokens = new BigNumber(100);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount));

    // Check input is empty
    const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

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

      // eslint-disable-next-line
      await waitFor(() => expect(input.value).toBe(expectedInputValue));

      // Check submit button is enabled
      expect(
        getByText(en.operationModal.repay.submitButtonLabel.repay).closest('button'),
      ).not.toBeDisabled();
    }
  });

  it('lets user repay borrowed tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = vi.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repay as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={onCloseMock} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const correctAmountTokens = 1;

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationModal.repay.submitButtonLabel.repay));

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(repay).toHaveBeenCalledTimes(1));
    expect(repay).toHaveBeenCalledWith({
      amountWei: expectedAmountWei,
      isRepayingFullLoan: false,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: fakeAsset.vToken.underlyingToken,
        valueWei: expectedAmountWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it('lets user repay full loan', async () => {
    (repay as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.repay.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    // Click on 100% button
    fireEvent.click(getByText('100%'));

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.operationModal.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    // Click on submit button
    await waitFor(() => getByText(en.operationModal.repay.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationModal.repay.submitButtonLabel.repay));

    await waitFor(() => expect(repay).toHaveBeenCalledTimes(1));
    expect(repay).toHaveBeenCalledWith({
      amountWei: fakeAsset.userBorrowBalanceTokens.multipliedBy(1e18), // Convert borrow balance to wei
      isRepayingFullLoan: true,
    });
  });
});
