import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { ExactAmountInSwap, ExactAmountOutSwap, Token } from 'types';
import { convertTokensToWei, convertWeiToTokens } from 'utilities';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { getBalanceOf, swapTokens } from 'clients/api';
import {
  getTokenInput,
  getTokenSelectButton,
  selectToken,
} from 'components/SelectTokenTextField/testUtils';
import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import SwapPage from '.';
import TEST_IDS from './testIds';
import useGetSwapInfo from './useGetSwapInfo';

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');
jest.mock('./useGetSwapInfo');
jest.mock('hooks/useTokenApproval');

const getLastUseGetSwapInfoCallArgs = () =>
  (useGetSwapInfo as jest.Mock).mock.calls[(useGetSwapInfo as jest.Mock).mock.calls.length - 1];

const FAKE_DEFAULT_BALANCE_TOKENS = '1';

const FAKE_BNB_BALANCE_TOKENS = '10';
const FAKE_BNB_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BNB_BALANCE_TOKENS),
  token: PANCAKE_SWAP_TOKENS.bnb,
});

const FAKE_BUSD_BALANCE_TOKENS = '20';
const FAKE_BUSD_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BUSD_BALANCE_TOKENS),
  token: PANCAKE_SWAP_TOKENS.busd,
});

const FAKE_CAKE_BALANCE_TOKENS = '30';
const FAKE_CAKE_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_CAKE_BALANCE_TOKENS),
  token: PANCAKE_SWAP_TOKENS.cake,
});

const fakeExactAmountInSwap: ExactAmountInSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.bnb,
  fromTokenAmountSoldWei: FAKE_BNB_BALANCE_WEI,
  toToken: PANCAKE_SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(1.5),
  expectedToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(2),
  direction: 'exactAmountIn',
  routePath: [PANCAKE_SWAP_TOKENS.bnb.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

const fakeExactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.bnb,
  expectedFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(1.5),
  maximumFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(2),
  toToken: PANCAKE_SWAP_TOKENS.busd,
  toTokenAmountReceivedWei: FAKE_BUSD_BALANCE_WEI,
  direction: 'exactAmountOut',
  routePath: [PANCAKE_SWAP_TOKENS.bnb.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

const fakeNonNativeSwap: ExactAmountInSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.cake,
  fromTokenAmountSoldWei: FAKE_CAKE_BALANCE_WEI,
  toToken: PANCAKE_SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: FAKE_CAKE_BALANCE_WEI.multipliedBy(1.5),
  expectedToTokenAmountReceivedWei: FAKE_CAKE_BALANCE_WEI.multipliedBy(2),
  direction: 'exactAmountIn',
  routePath: [PANCAKE_SWAP_TOKENS.cake.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

const useTokenApprovalOriginal = useTokenApproval(
  // These aren't used since useTokenApproval is mocked
  {
    token: PANCAKE_SWAP_TOKENS.cake,
    spenderAddress: '',
    accountAddress: '',
  },
);

describe('pages/Swap', () => {
  beforeEach(() => {
    (getBalanceOf as jest.Mock).mockImplementation(({ token }: { token: Token }) => {
      let fakeBalanceTokens = FAKE_DEFAULT_BALANCE_TOKENS;

      if (token.isNative) {
        fakeBalanceTokens = FAKE_BNB_BALANCE_TOKENS;
      } else if (token.address === PANCAKE_SWAP_TOKENS.busd.address) {
        fakeBalanceTokens = FAKE_BUSD_BALANCE_TOKENS;
      }

      return {
        balanceWei: convertTokensToWei({
          value: new BigNumber(fakeBalanceTokens),
          token,
        }),
      };
    });
  });

  beforeEach(() => {
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: undefined,
      error: undefined,
    }));

    (useTokenApproval as jest.Mock).mockImplementation(() => useTokenApprovalOriginal);
  });

  it('renders without crashing', () => {
    renderComponent(<SwapPage />);
  });

  it('displays user fromToken and toToken balances correctly', async () => {
    const { getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() => expect(getByText(`${FAKE_BNB_BALANCE_TOKENS} BNB`)));
    await waitFor(() => expect(getByText(`${FAKE_BUSD_BALANCE_TOKENS} BUSD`)));
  });

  it('updates toToken when changing fromToken for toToken', () => {
    const { container } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Since the initial toToken is BUSD, we change fromToken for BUSD
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    // Check toToken was updated to fromToken
    expect(
      getTokenSelectButton({
        container,
        selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      }).textContent,
    ).toBe(PANCAKE_SWAP_TOKENS.bnb.symbol);

    expect(
      getTokenSelectButton({
        container,
        selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }).textContent,
    ).toBe(PANCAKE_SWAP_TOKENS.busd.symbol);

    // Revert toToken back to BUSD
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    // Check fromToken was updated to toToken
    expect(
      getTokenSelectButton({
        container,
        selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }).textContent,
    ).toBe(PANCAKE_SWAP_TOKENS.bnb.symbol);

    expect(
      getTokenSelectButton({
        container,
        selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      }).textContent,
    ).toBe(PANCAKE_SWAP_TOKENS.busd.symbol);
  });

  it('switches form values when pressing on switch tokens button', () => {
    const { container, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

    const toTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
    }) as HTMLInputElement;

    // Check fromToken and toToken inputs are empty on mount
    expect(fromTokenInput.value).toBe('');
    expect(toTokenInput.value).toBe('');

    // Enter amount in fromToken input
    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });
    expect(fromTokenInput.value).toBe(FAKE_BNB_BALANCE_TOKENS);

    // Check swap direction is correct
    expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountIn');

    // Click on switch tokens buttons
    fireEvent.click(getByTestId(TEST_IDS.switchTokensButton));

    // Check input values were updated correctly
    expect(fromTokenInput.value).toBe('');
    expect(toTokenInput.value).toBe(FAKE_BNB_BALANCE_TOKENS);

    // Check tokens were updated correctly
    expect(
      getTokenSelectButton({
        container,
        selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }).textContent,
    ).toBe(PANCAKE_SWAP_TOKENS.busd.symbol);

    expect(
      getTokenSelectButton({
        container,
        selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      }).textContent,
    ).toBe(PANCAKE_SWAP_TOKENS.bnb.symbol);

    // Check swap direction was updated correctly
    expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountOut');
  });

  it('disables submit button on mount', () => {
    const { getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
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
    }));

    const { container, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

    // Enter valid amount in fromToken input
    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
      valueWei: fakeExactAmountInSwap.fromTokenAmountSoldWei,
      token: fakeExactAmountInSwap.fromToken,
    });

    const expectedMinimumToTokenAmountReceivedTokens = convertWeiToTokens({
      valueWei: fakeExactAmountInSwap.minimumToTokenAmountReceivedWei,
      token: fakeExactAmountInSwap.fromToken,
    });

    // Check submit button is enabled
    const enabledSubmitButtonText = getByText(
      en.swapPage.submitButton.enabledLabel
        .replace(
          '{{fromTokenAmount}}',
          `${expectedFromTokenAmountSoldTokens.toFixed()} ${
            fakeExactAmountInSwap.fromToken.symbol
          }`,
        )
        .replace(
          '{{toTokenAmount}}',
          `${expectedMinimumToTokenAmountReceivedTokens.toFixed()} ${
            fakeExactAmountInSwap.toToken.symbol
          }`,
        ),
    );

    expect(enabledSubmitButtonText);
    await waitFor(() => expect(enabledSubmitButtonText.closest('button')).toBeEnabled());

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
    }));

    const { container, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

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
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Change toToken to wBNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.wbnb,
    });

    const submitButtonTest = getByText(en.swapPage.submitButton.disabledLabels.wrappingUnsupported);
    expect(submitButtonTest);
    await waitFor(() => expect(submitButtonTest.closest('button')).toBeDisabled());
  });

  it('disables submit button when swap is an unwrap', async () => {
    const { container, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Change fromToken to wBNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.wbnb,
    });

    // Change toToken to BNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.bnb,
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
    }));

    const { container } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

    // Enter valid amount in fromToken input
    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check toToken input value was updated correctly
    const toTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
    }) as HTMLInputElement;

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
    }));

    const { container } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    const toTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
    }) as HTMLInputElement;

    // Enter valid amount in toToken input
    fireEvent.change(toTokenInput, { target: { value: FAKE_BUSD_BALANCE_TOKENS } });

    // Check fromToken input value was updated correctly
    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

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
    }));

    const { container } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Update fromToken input value
    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check swap direction is correct
    await waitFor(() => expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountIn'));

    // Update toToken input value
    const toTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
    }) as HTMLInputElement;

    fireEvent.change(toTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    await waitFor(() =>
      expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountOut'),
    );
  });

  it.each([
    [fakeExactAmountInSwap.direction, fakeExactAmountInSwap],
    [fakeExactAmountOutSwap.direction, fakeExactAmountOutSwap],
  ])('displays %s swap details correctly ', async (_swapDirection, swap) => {
    const { queryByTestId, container, getByTestId } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Check no swap details are being displayed on mount
    expect(queryByTestId(TEST_IDS.swapDetails)).toBeNull();

    // Simulate a swap having been fetched
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap,
      error: undefined,
    }));

    // Update fromToken input value to trigger rerender and display swap details
    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

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
    }));

    const { container, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Change fromToken for a non-native token
    selectToken({
      container,
      token: fakeNonNativeSwap.fromToken,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    });

    // Enter valid amount in fromToken input
    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_DEFAULT_BALANCE_TOKENS } });

    // Check submit button is disabled
    const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
      valueWei: fakeNonNativeSwap.fromTokenAmountSoldWei,
      token: fakeNonNativeSwap.fromToken,
    });

    const expectedMinimumToTokenAmountReceivedTokens = convertWeiToTokens({
      valueWei: fakeNonNativeSwap.minimumToTokenAmountReceivedWei,
      token: fakeNonNativeSwap.fromToken,
    });

    const submitButtonText = getByText(
      en.swapPage.submitButton.enabledLabel
        .replace(
          '{{fromTokenAmount}}',
          `${expectedFromTokenAmountSoldTokens.toFixed()} ${fakeNonNativeSwap.fromToken.symbol}`,
        )
        .replace(
          '{{toTokenAmount}}',
          `${expectedMinimumToTokenAmountReceivedTokens.toFixed()} ${
            fakeNonNativeSwap.toToken.symbol
          }`,
        ),
    );

    await waitFor(() => expect(submitButtonText));
    await waitFor(() => expect(submitButtonText.closest('button')).toBeDisabled());

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
    }));

    (swapTokens as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { container, getByText } = renderComponent(<SwapPage />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Enter valid amount in fromToken input
    const fromTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
    }) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
      valueWei: fakeExactAmountInSwap.fromTokenAmountSoldWei,
      token: fakeExactAmountInSwap.fromToken,
    });

    const expectedMinimumToTokenAmountReceivedTokens = convertWeiToTokens({
      valueWei: fakeExactAmountInSwap.minimumToTokenAmountReceivedWei,
      token: fakeExactAmountInSwap.fromToken,
    });

    // Check submit button is enabled
    const enabledSubmitButtonText = getByText(
      en.swapPage.submitButton.enabledLabel
        .replace(
          '{{fromTokenAmount}}',
          `${expectedFromTokenAmountSoldTokens.toFixed()} ${
            fakeExactAmountInSwap.fromToken.symbol
          }`,
        )
        .replace(
          '{{toTokenAmount}}',
          `${expectedMinimumToTokenAmountReceivedTokens.toFixed()} ${
            fakeExactAmountInSwap.toToken.symbol
          }`,
        ),
    );

    expect(enabledSubmitButtonText);
    await waitFor(() => expect(enabledSubmitButtonText.closest('button')).toBeEnabled());

    // Submit form
    fireEvent.click(enabledSubmitButtonText);

    // Check swap was executed
    await waitFor(() => expect(swapTokens).toHaveBeenCalledTimes(1));
    expect(swapTokens).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      swap: fakeExactAmountInSwap,
    });

    // Check success modal transaction was displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      title: en.swapPage.successfulConvertTransactionModal.title,
      content: en.swapPage.successfulConvertTransactionModal.message,
      transactionHash: fakeTransactionReceipt.transactionHash,
    });

    // Check form was reset
    await waitFor(() => expect(fromTokenInput.value).toBe(''));

    const toTokenInput = getTokenInput({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
    }) as HTMLInputElement;

    expect(toTokenInput.value).toBe('');
  });
});
