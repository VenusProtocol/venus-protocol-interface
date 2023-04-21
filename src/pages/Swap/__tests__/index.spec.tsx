import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { convertWeiToTokens } from 'utilities';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeTokenBalances, {
  FAKE_BNB_BALANCE_TOKENS,
  FAKE_DEFAULT_BALANCE_TOKENS,
} from '__mocks__/models/tokenBalances';
import { swapTokens } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__tests__/testUtils';
import {
  getTokenMaxButtonTestId,
  getTokenSelectButtonTestId,
  getTokenTextFieldTestId,
} from 'components/SelectTokenTextField/testIdGetters';
import { SWAP_TOKENS } from 'constants/tokens';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import SwapPage from '..';
import TEST_IDS from '../testIds';
import { fakeExactAmountInSwap, fakeExactAmountOutSwap, fakeNonNativeSwap } from './fakeData';
import { getEnabledSubmitButton, getLastUseGetSwapInfoCallArgs } from './testUtils';

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');
jest.mock('hooks/useTokenApproval');
jest.mock('hooks/useGetSwapTokenUserBalances');
jest.mock('hooks/useGetSwapInfo');

const useTokenApprovalOriginal = useTokenApproval(
  // These aren't used since useTokenApproval is mocked
  {
    token: SWAP_TOKENS.cake,
    spenderAddress: '',
    accountAddress: '',
  },
);

describe('pages/Swap', () => {
  beforeEach(() => {
    (useGetSwapTokenUserBalances as jest.Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));
  });

  beforeEach(() => {
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: undefined,
      error: undefined,
      isLoading: false,
    }));

    (useTokenApproval as jest.Mock).mockImplementation(() => useTokenApprovalOriginal);
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

    await waitFor(() =>
      expect(getByText(`${new BigNumber(FAKE_BNB_BALANCE_TOKENS).toFormat()} BNB`)),
    );
    await waitFor(() =>
      expect(getByText(`${new BigNumber(FAKE_DEFAULT_BALANCE_TOKENS).toFormat()} XVS`)),
    );
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
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { container, getByText, getByTestId } = renderComponent(<SwapPage />, {
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
    const enabledSubmitButton = getEnabledSubmitButton({
      container,
      swap: fakeExactAmountInSwap,
    });

    await waitFor(() => expect(enabledSubmitButton).toBeEnabled());

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

  it('disables submit button if no swap is found', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
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

    const submitButtonTest = getByText(
      en.swapPage.submitButton.disabledLabels.insufficientLiquidity,
    );
    expect(submitButtonTest);
    await waitFor(() => expect(submitButtonTest.closest('button')).toBeDisabled());
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

    const submitButtonTest = getByText(en.swapPage.submitButton.disabledLabels.wrappingUnsupported);
    expect(submitButtonTest);
    await waitFor(() => expect(submitButtonTest.closest('button')).toBeDisabled());
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

    const submitButtonTest = getByText(
      en.swapPage.submitButton.disabledLabels.unwrappingUnsupported,
    );
    expect(submitButtonTest);
    await waitFor(() => expect(submitButtonTest.closest('button')).toBeDisabled());
  });

  it('updates toToken input value correctly when user updates fromToken input value', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
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
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
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
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
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
    const { queryByTestId, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check no swap details are being displayed on mount
    expect(queryByTestId(TEST_IDS.swapDetails)).toBeNull();

    // Simulate a swap having been fetched
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
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

  it('asks user to approve a non-native token before they can execute a swap', async () => {
    (useTokenApproval as jest.Mock).mockImplementation(() => ({
      ...useTokenApprovalOriginal,
      isTokenApproved: false,
    }));

    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: fakeNonNativeSwap,
      error: undefined,
      isLoading: false,
    }));

    const { container, getByText, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Change fromToken for a non-native token
    selectToken({
      container,
      token: fakeNonNativeSwap.fromToken,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    });

    // Enter valid amount in fromToken input
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_DEFAULT_BALANCE_TOKENS } });

    // Check submit button is disabled
    const submitButton = getEnabledSubmitButton({
      swap: fakeNonNativeSwap,
      container,
    });
    await waitFor(() => expect(submitButton).toBeDisabled());

    // Check enable token button is showing and enabled
    const enableTokenButtonTextContent = en.swapPage.enablingStep.enableTokenButton.text.replace(
      '{{tokenSymbol}}',
      fakeNonNativeSwap.fromToken.symbol,
    );
    const enableTokenButtonText = getByText(enableTokenButtonTextContent);

    expect(enableTokenButtonText);
    await waitFor(() => expect(enableTokenButtonText.closest('button')).toBeEnabled());

    // Click on enable token
    fireEvent.click(enableTokenButtonText);

    // Check token approval was requested
    await waitFor(() => expect(useTokenApprovalOriginal.approveToken).toHaveBeenCalledTimes(1));
  });

  it('lets user swap an already approved token for another token and displays a successful transaction modal on success', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    (swapTokens as jest.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { container, getByTestId } = renderComponent(<SwapPage />, {
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
    const submitButton = getEnabledSubmitButton({
      swap: fakeExactAmountInSwap,
      container,
    });
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
      title: en.swapPage.successfulConvertTransactionModal.title,
      content: en.swapPage.successfulConvertTransactionModal.message,
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
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { container, getByTestId, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // wait for the balance to be updated
    await waitFor(() =>
      expect(getByText(`${new BigNumber(FAKE_BNB_BALANCE_TOKENS).toFormat()} BNB`)),
    );

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
    const submitButton = getEnabledSubmitButton({
      swap: fakeExactAmountInSwap,
      container,
    });
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
