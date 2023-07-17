import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Swap } from 'types';
import { convertWeiToTokens } from 'utilities';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeTokenBalances, {
  FAKE_BNB_BALANCE_TOKENS,
  FAKE_DEFAULT_BALANCE_TOKENS,
} from '__mocks__/models/tokenBalances';
import { swapTokens } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import {
  getTokenMaxButtonTestId,
  getTokenSelectButtonTestId,
  getTokenTextFieldTestId,
} from 'components/SelectTokenTextField/testIdGetters';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { SWAP_TOKENS, TESTNET_TOKENS, TESTNET_VBEP_TOKENS } from 'constants/tokens';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import SwapPage from '..';
import { fakeExactAmountInSwap, fakeExactAmountOutSwap } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('clients/api');
vi.mock('hooks/useSuccessfulTransactionModal');
vi.mock('hooks/useGetSwapTokenUserBalances');
vi.mock('hooks/useGetSwapInfo');
vi.mock('hooks/useTokenApproval');

export const getLastUseGetSwapInfoCallArgs = () =>
  (useGetSwapInfo as Vi.Mock).mock.calls[(useGetSwapInfo as Vi.Mock).mock.calls.length - 1];

describe('pages/Swap', () => {
  beforeEach(() => {
    (useGetSwapTokenUserBalances as Vi.Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));

    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: undefined,
      error: undefined,
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<SwapPage />);
  });

  it('displays user fromToken and toToken balances correctly', async () => {
    const { getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() => expect(getByText('200.00K BNB')));
    await waitFor(() => expect(getByText('10.00K XVS')));
  });

  it('updates toToken when changing fromToken for toToken', () => {
    const { container, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Since the initial toToken is XVS, we change fromToken for XVS
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: SWAP_TOKENS.xvs,
    });

    // Check toToken was updated to fromToken
    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.bnb.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.xvs.symbol);

    // Revert toToken back to XVS
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: SWAP_TOKENS.xvs,
    });

    // Check fromToken was updated to toToken
    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.bnb.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.xvs.symbol);
  });

  it('switches form values when pressing on switch tokens button', () => {
    const { getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    const toTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.toTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Check fromToken and toToken inputs are empty on mount
    expect(fromTokenInput.value).toBe('');
    expect(toTokenInput.value).toBe('');

    // Enter amount in fromToken input
    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });
    expect(fromTokenInput.value).toBe(FAKE_BNB_BALANCE_TOKENS);

    // Check swap direction is correct
    expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountIn');

    // Click on switch tokens button
    fireEvent.click(getByTestId(TEST_IDS.switchTokensButton));

    // Check input values were updated correctly
    expect(fromTokenInput.value).toBe('');
    expect(toTokenInput.value).toBe(FAKE_BNB_BALANCE_TOKENS);

    // Check tokens were updated correctly
    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.xvs.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.bnb.symbol);

    // Check swap direction was updated correctly
    expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountOut');

    // Click on switch tokens button again
    fireEvent.click(getByTestId(TEST_IDS.switchTokensButton));

    // Check input values were updated back correctly
    expect(fromTokenInput.value).toBe(FAKE_BNB_BALANCE_TOKENS);
    expect(toTokenInput.value).toBe('');

    // Check tokens were updated correctly
    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.bnb.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(SWAP_TOKENS.xvs.symbol);

    // Check swap direction was updated back correctly
    expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountIn');
  });

  it('disables submit button on mount', () => {
    const { getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    const submitButtonText = getByText(
      en.swapPage.submitButton.disabledLabels.invalidFromTokenAmount,
    );

    expect(submitButtonText);
    expect(submitButtonText.closest('button')).toBeDisabled();
  });

  it('disables submit button if fromToken amount entered is higher than user balance', async () => {
    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in fromToken input
    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check submit button is enabled
    const submitButton = getByText(en.swapPage.submitButton.enabledLabels.swap).closest('button');
    await waitFor(() => expect(submitButton).toBeEnabled());

    // Enter amount higher than user balance in fromToken input
    fireEvent.change(fromTokenInput, {
      target: { value: parseInt(FAKE_BNB_BALANCE_TOKENS, 10) + 1 },
    });

    const disabledSubmitButtonText = getByText(
      en.swapPage.submitButton.disabledLabels.insufficientUserBalance.replace(
        '{{tokenSymbol}}',
        fakeExactAmountInSwap.fromToken.symbol,
      ),
    );
    expect(disabledSubmitButtonText);
    await waitFor(() => expect(disabledSubmitButtonText.closest('button')).toBeDisabled());
  });

  it('disables submit button and displays error notice if token has been approved but amount entered is higher than wallet spending limit', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: TESTNET_TOKENS.xvs,
      spenderAddress: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'].address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByText, getByTestId, container } = renderComponent(() => <SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check submit button is disabled
    const submitButtonText = getByText(
      en.swapPage.submitButton.disabledLabels.invalidFromTokenAmount,
    );
    await waitFor(() => expect(submitButtonText.closest('button')).toBeDisabled());

    // Change fromToken to XVS
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: SWAP_TOKENS.xvs,
    });

    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter invalid amount in fromToken input
    const incorrectValueTokens = fakeWalletSpendingLimitTokens
      // Add one token too much
      .plus(1)
      .toFixed();

    fireEvent.change(fromTokenInput, { target: { value: incorrectValueTokens } });

    // TODO: Check error notice is displayed
    await waitFor(() => expect(getByText(en.swap.amountAboveWalletSpendingLimit)));

    // Check submit button is still disabled
    await waitFor(() => getByText(en.swapPage.submitButton.disabledLabels.spendingLimitTooLow));
    expect(
      getByText(en.swapPage.submitButton.disabledLabels.spendingLimitTooLow).closest('button'),
    ).toBeDisabled();
  });

  it('displays the wallet spending limit correctly and lets user revoke it', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: TESTNET_TOKENS.xvs,
      spenderAddress: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'].address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId, container } = renderComponent(() => <SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Change fromToken to XVS
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: SWAP_TOKENS.xvs,
    });

    // Check spending limit is correctly displayedy
    await waitFor(() => getByTestId(TEST_IDS.spendingLimit));
    expect(getByTestId(TEST_IDS.spendingLimit).textContent).toMatchSnapshot();

    // Press on revoke button
    const revokeSpendingLimitButton = within(getByTestId(TEST_IDS.spendingLimit)).getByRole(
      'button',
    );

    fireEvent.click(revokeSpendingLimitButton);

    await waitFor(() => expect(fakeRevokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('disables submit button if no swap is found', async () => {
    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: undefined,
      error: 'INSUFFICIENT_LIQUIDITY',
      isLoading: false,
    }));

    const { getByTestId, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in fromToken input
    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    const submitButtonText = getByText(
      en.swapPage.submitButton.disabledLabels.insufficientLiquidity,
    );
    expect(submitButtonText);
    await waitFor(() => expect(submitButtonText.closest('button')).toBeDisabled());
  });

  it('disables submit button when swap is a wrap', async () => {
    const { container, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Change toToken to wBNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: SWAP_TOKENS.wbnb,
    });

    const submitButtonText = getByText(en.swapPage.submitButton.disabledLabels.wrappingUnsupported);
    expect(submitButtonText);
    await waitFor(() => expect(submitButtonText.closest('button')).toBeDisabled());
  });

  it('disables submit button when swap is an unwrap', async () => {
    const { container, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Change fromToken to wBNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: SWAP_TOKENS.wbnb,
    });

    // Change toToken to BNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: SWAP_TOKENS.bnb,
    });

    const submitButtonText = getByText(
      en.swapPage.submitButton.disabledLabels.unwrappingUnsupported,
    );
    expect(submitButtonText);
    await waitFor(() => expect(submitButtonText.closest('button')).toBeDisabled());
  });

  it('updates toToken input value correctly when user updates fromToken input value', async () => {
    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in fromToken input
    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check toToken input value was updated correctly
    const toTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.toTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    const expectedToTokenAmountReceivedTokens = convertWeiToTokens({
      valueWei: fakeExactAmountInSwap.expectedToTokenAmountReceivedWei,
      token: fakeExactAmountInSwap.fromToken,
    });

    await waitFor(() =>
      expect(toTokenInput.value).toBe(expectedToTokenAmountReceivedTokens.toFixed()),
    );

    // Empty fromToken input
    fireEvent.change(fromTokenInput, { target: { value: '' } });

    await waitFor(() => expect(toTokenInput.value).toBe(''));
  });

  it('updates fromToken input value correctly when user updates toToken input value', async () => {
    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: fakeExactAmountOutSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    const toTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.toTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in toToken input
    fireEvent.change(toTokenInput, { target: { value: FAKE_DEFAULT_BALANCE_TOKENS } });

    // Check fromToken input value was updated correctly
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
      valueWei: fakeExactAmountOutSwap.expectedFromTokenAmountSoldWei,
      token: fakeExactAmountOutSwap.fromToken,
    });

    await waitFor(() =>
      expect(fromTokenInput.value).toBe(expectedFromTokenAmountSoldTokens.toFixed()),
    );

    // Empty toToken input
    fireEvent.change(toTokenInput, { target: { value: '' } });

    await waitFor(() => expect(fromTokenInput.value).toBe(''));
  });

  it('updates swap direction correctly when updating an input value', async () => {
    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Update fromToken input value
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check swap direction is correct
    await waitFor(() => expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountIn'));

    // Update toToken input value
    const toTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.toTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(toTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    await waitFor(() =>
      expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountOut'),
    );
  });

  it.each([
    [fakeExactAmountInSwap.direction, fakeExactAmountInSwap],
    [fakeExactAmountOutSwap.direction, fakeExactAmountOutSwap],
  ])('displays %s swap details correctly ', async (_swapDirection, swap) => {
    const { getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check only slippage tolerance is displayed on mount
    expect(getByTestId(TEST_IDS.swapDetails).textContent).toMatchSnapshot();

    // Simulate a swap having been fetched
    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap,
      error: undefined,
      isLoading: false,
    }));

    // Update fromToken input value to trigger rerender and display swap details
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    expect(getByTestId(TEST_IDS.swapDetails).textContent).toMatchSnapshot();
  });

  it('displays warning notice and set correct submit button label if the swap has a high price impact', async () => {
    const customFakeSwap: Swap = {
      ...fakeExactAmountInSwap,
      priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: customFakeSwap,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Update fromToken input value to trigger rerender
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check warning notice is displayed
    await waitFor(() => getByText(en.operationModal.supply.swappingWithHighPriceImpactWarning));

    // Check submit button has correct label and is enabled
    await waitFor(() => getByText(en.swapPage.submitButton.enabledLabels.swapWithHighPriceImpact));
    const submitButton = getByText(
      en.swapPage.submitButton.enabledLabels.swapWithHighPriceImpact,
    ).closest('button');
    expect(submitButton).toBeEnabled();
  });

  it('disables submit button when price impact has reached the maximum tolerated', async () => {
    const customFakeSwap: Swap = {
      ...fakeExactAmountInSwap,
      priceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: customFakeSwap,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Update fromToken input value to trigger rerender
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check submit button has correct label and is disabled
    await waitFor(() =>
      getByText(en.swapPage.submitButton.disabledLabels.priceImpactHigherThanMaximumTolerated),
    );
    const submitButton = getByText(
      en.swapPage.submitButton.disabledLabels.priceImpactHigherThanMaximumTolerated,
    ).closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('lets user swap an already approved token for another token and displays a successful transaction modal on success', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    (swapTokens as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Enter valid amount in fromToken input
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check submit button is enabled
    const submitButton = getByText(en.swapPage.submitButton.enabledLabels.swap);
    await waitFor(() => expect(submitButton).toBeEnabled());

    // Submit form
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.click(submitButton!);

    // Check swap was executed
    await waitFor(() => expect(swapTokens).toHaveBeenCalledTimes(1));
    expect(swapTokens).toHaveBeenCalledWith({
      swap: fakeExactAmountInSwap,
    });

    // Check success modal transaction was displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      title: en.swapPage.successfulSwapTransactionModal.title,
      content: en.swapPage.successfulSwapTransactionModal.message,
      transactionHash: fakeContractReceipt.transactionHash,
    });

    // Check form was reset
    await waitFor(() => expect(fromTokenInput.value).toBe(''));

    const toTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.toTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    expect(toTokenInput.value).toBe('');
  });

  it('updates fromToken input value correctly when user clicks on the max toToken button', async () => {
    (useGetSwapInfo as Vi.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // wait for the balance to be updated
    await waitFor(() => expect(getByText('200.00K BNB')));

    // get and click the MAX from token button
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    const fromTokenMaxButton = getByTestId(
      getTokenMaxButtonTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.click(fromTokenMaxButton);

    const toTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.toTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Check if toInput input value was updated correctly
    const expectedToTokenAmountSoldTokens = convertWeiToTokens({
      valueWei: fakeExactAmountInSwap.expectedToTokenAmountReceivedWei,
      token: fakeExactAmountInSwap.toToken,
    });

    await waitFor(() => expect(fromTokenInput.value).toBe(FAKE_BNB_BALANCE_TOKENS));

    await waitFor(() => expect(toTokenInput.value).toBe(expectedToTokenAmountSoldTokens.toFixed()));

    // Check submit button is enabled
    const submitButton = getByText(en.swapPage.submitButton.enabledLabels.swap);
    await waitFor(() => expect(submitButton).toBeEnabled());

    // Submit form
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.click(submitButton!);

    // Check swap was executed
    await waitFor(() => expect(swapTokens).toHaveBeenCalledTimes(1));
    expect(swapTokens).toHaveBeenCalledWith({
      swap: fakeExactAmountInSwap,
    });
  });
});
