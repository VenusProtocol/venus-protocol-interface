import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTokenBalances, {
  FAKE_BNB_BALANCE_TOKENS,
  FAKE_DEFAULT_BALANCE_TOKENS,
} from '__mocks__/models/tokenBalances';
import { bnb, wbnb, xvs } from '__mocks__/models/tokens';
import { vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { useSwapTokens } from 'clients/api';
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
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import type { Swap } from 'types';
import { convertMantissaToTokens } from 'utilities';

import SwapPage from '..';
import { fakeExactAmountInSwap, fakeExactAmountOutSwap } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('hooks/useGetSwapTokenUserBalances');
vi.mock('hooks/useGetSwapInfo');
vi.mock('hooks/useTokenApproval');

const mockSwapTokens = vi.fn();

export const getLastUseGetSwapInfoCallArgs = () =>
  (useGetSwapInfo as Mock).mock.calls[(useGetSwapInfo as Mock).mock.calls.length - 1];

describe('Swap', () => {
  beforeEach(() => {
    (useGetSwapTokenUserBalances as Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: undefined,
      error: undefined,
      isLoading: false,
    }));

    (useSwapTokens as Mock).mockImplementation(() => ({
      mutateAsync: mockSwapTokens,
      isPending: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<SwapPage />);
  });

  it('displays user fromToken and toToken balances correctly', async () => {
    const { getByText } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(getByText('200K BNB')));
    await waitFor(() => expect(getByText('10K XVS')));
  });

  it('updates toToken when changing fromToken for toToken', () => {
    const { container, getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
    });

    // Since the initial toToken is XVS, we change fromToken for XVS
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: xvs,
    });

    // Check toToken was updated to fromToken
    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(bnb.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(xvs.symbol);

    // Revert toToken back to XVS
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: xvs,
    });

    // Check fromToken was updated to toToken
    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(bnb.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(xvs.symbol);
  });

  it('switches form values when clicking on switch tokens button', () => {
    const { getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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
    ).toBe(xvs.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(bnb.symbol);

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
    ).toBe(bnb.symbol);

    expect(
      getByTestId(
        getTokenSelectButtonTestId({
          parentTestId: TEST_IDS.toTokenSelectTokenTextField,
        }),
      ).textContent,
    ).toBe(xvs.symbol);

    // Check swap direction was updated back correctly
    expect(getLastUseGetSwapInfoCallArgs()[0].direction).toBe('exactAmountIn');
  });

  it('disables submit button on mount', () => {
    const { getByText } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
    });

    const submitButtonText = getByText(
      en.swapPage.submitButton.disabledLabels.invalidFromTokenAmount,
    );

    expect(submitButtonText);
    expect(submitButtonText.closest('button')).toBeDisabled();
  });

  it('disables submit button if fromToken amount entered is higher than user balance', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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
      target: { value: Number.parseInt(FAKE_BNB_BALANCE_TOKENS, 10) + 1 },
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
      token: xvs,
      spenderAddress: vXvs.address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);

    (useTokenApproval as Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByText, getByTestId, container } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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
      token: xvs,
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

    // Check error notice is displayed
    await waitFor(() => expect(getByText(en.swap.errors.amountAboveWalletSpendingLimit)));

    // Check submit button is still disabled
    await waitFor(() => getByText(en.swapPage.submitButton.disabledLabels.spendingLimitTooLow));
    expect(
      getByText(en.swapPage.submitButton.disabledLabels.spendingLimitTooLow).closest('button'),
    ).toBeDisabled();
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

    const { getByTestId, container } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
    });

    // Change fromToken to XVS
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: xvs,
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
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: undefined,
      error: 'INSUFFICIENT_LIQUIDITY',
      isLoading: false,
    }));

    const { getByTestId, getByText } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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
      accountAddress: fakeAccountAddress,
    });

    // Change toToken to wBNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: wbnb,
    });

    const submitButtonText = getByText(en.swapPage.submitButton.disabledLabels.wrappingUnsupported);
    expect(submitButtonText);
    await waitFor(() => expect(submitButtonText.closest('button')).toBeDisabled());
  });

  it('disables submit button when swap is an unwrap', async () => {
    const { container, getByText } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
    });

    // Change fromToken to wBNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.fromTokenSelectTokenTextField,
      token: wbnb,
    });

    // Change toToken to BNB
    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.toTokenSelectTokenTextField,
      token: bnb,
    });

    const submitButtonText = getByText(
      en.swapPage.submitButton.disabledLabels.unwrappingUnsupported,
    );
    expect(submitButtonText);
    await waitFor(() => expect(submitButtonText.closest('button')).toBeDisabled());
  });

  it('updates toToken input value correctly when user updates fromToken input value', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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

    const expectedToTokenAmountReceivedTokens = convertMantissaToTokens({
      value: fakeExactAmountInSwap.expectedToTokenAmountReceivedMantissa,
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
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeExactAmountOutSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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

    const expectedFromTokenAmountSoldTokens = convertMantissaToTokens({
      value: fakeExactAmountOutSwap.expectedFromTokenAmountSoldMantissa,
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
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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
      accountAddress: fakeAccountAddress,
    });

    // Check only slippage tolerance is displayed on mount
    expect(getByTestId(TEST_IDS.swapDetails).textContent).toMatchSnapshot();

    // Simulate a swap having been fetched
    (useGetSwapInfo as Mock).mockImplementation(() => ({
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

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: customFakeSwap,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
    });

    // Update fromToken input value to trigger rerender
    const fromTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.fromTokenSelectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(fromTokenInput, { target: { value: FAKE_BNB_BALANCE_TOKENS } });

    // Check warning notice is displayed
    await waitFor(() => getByText(en.operationForm.warning.swappingWithHighPriceImpactWarning));

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

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: customFakeSwap,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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

  it('lets user swap an already approved token for another token', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByText, getByTestId } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
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
    fireEvent.click(submitButton!);

    // Check swap was executed
    await waitFor(() => expect(mockSwapTokens).toHaveBeenCalledTimes(1));
    expect(mockSwapTokens.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "poolComptrollerContractAddress": "0x94d1820b2D1c7c7452A163983Dc888CEC546b77D",
          "swap": {
            "direction": "exactAmountIn",
            "exchangeRate": "2",
            "expectedToTokenAmountReceivedMantissa": "4e+23",
            "fromToken": {
              "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
              "asset": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20clip-path='url(%23A)'%3e%3cg%20clip-path='url(%23B)'%3e%3cpath%20fill-rule='evenodd'%20d='M12%200a12%2012%200%201%201%200%2024%2012%2012%200%201%201%200-24z'%20fill='%23f0b90b'/%3e%3cg%20fill='%23fff'%3e%3cpath%20d='M6.595%2012l.009%203.173L9.3%2016.76v1.858l-4.274-2.507v-5.039L6.595%2012zm0-3.173v1.849l-1.57-.929V7.898l1.57-.929%201.578.929-1.578.929zm3.831-.929l1.57-.929%201.578.929-1.578.929-1.57-.929zM7.73%2014.515v-1.858l1.57.929v1.849l-1.57-.92zm2.696%202.91l1.57.929%201.578-.929v1.849l-1.578.929-1.57-.929v-1.849zm5.4-9.527l1.57-.929%201.578.929v1.849l-1.578.929V8.827l-1.57-.929zm1.57%207.275L17.405%2012l1.57-.929v5.038l-4.274%202.507v-1.858l2.695-1.586zm-1.126-.658l-1.57.92v-1.849l1.57-.929v1.858zm0-5.03l.009%201.858-2.704%201.587v3.181l-1.57.92-1.57-.92V12.93l-2.704-1.587V9.485l1.577-.929%202.687%201.594%202.704-1.594%201.578.929h-.007zM7.73%206.313l4.266-2.515%204.274%202.515-1.57.929-2.704-1.594L9.3%207.241l-1.57-.929z'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='A'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3cclipPath%20id='B'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
              "decimals": 18,
              "isNative": true,
              "symbol": "BNB",
            },
            "fromTokenAmountSoldMantissa": "2e+23",
            "minimumToTokenAmountReceivedMantissa": "3e+23",
            "priceImpactPercentage": 0.001,
            "routePath": [
              "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
              "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
            ],
            "toToken": {
              "address": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
              "asset": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20clip-path='url(%23A)'%3e%3ccircle%20cx='12'%20cy='12'%20r='12'%20fill='%23f0b90b'/%3e%3cg%20fill='%23fff'%3e%3cpath%20d='M11.971%202.4l2.372%202.429L8.371%2010.8%206%208.429%2011.971%202.4zm3.6%203.6l2.372%202.429L8.371%2018%206%2015.629%2015.571%206zm-10.8%203.6l2.371%202.429L4.771%2014.4%202.4%2012.029%204.771%209.6zm14.401%200l2.371%202.429-9.571%209.572L9.6%2019.229%2019.172%209.6z'/%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='A'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
              "decimals": 18,
              "symbol": "BUSD",
            },
          },
        },
      ]
    `);

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
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeExactAmountInSwap,
      error: undefined,
      isLoading: false,
    }));

    const { getByTestId, getByText } = renderComponent(<SwapPage />, {
      accountAddress: fakeAccountAddress,
    });

    // wait for the balance to be updated
    await waitFor(() => expect(getByText('200K BNB')));

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
    const expectedToTokenAmountSoldTokens = convertMantissaToTokens({
      value: fakeExactAmountInSwap.expectedToTokenAmountReceivedMantissa,
      token: fakeExactAmountInSwap.toToken,
    });

    await waitFor(() => expect(fromTokenInput.value).toBe(FAKE_BNB_BALANCE_TOKENS));

    await waitFor(() => expect(toTokenInput.value).toBe(expectedToTokenAmountSoldTokens.toFixed()));

    // Check submit button is enabled
    const submitButton = getByText(en.swapPage.submitButton.enabledLabels.swap);
    await waitFor(() => expect(submitButton).toBeEnabled());

    // Submit form
    fireEvent.click(submitButton!);

    // Check swap was executed
    await waitFor(() => expect(mockSwapTokens).toHaveBeenCalledTimes(1));
    expect(mockSwapTokens.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "poolComptrollerContractAddress": "0x94d1820b2D1c7c7452A163983Dc888CEC546b77D",
          "swap": {
            "direction": "exactAmountIn",
            "exchangeRate": "2",
            "expectedToTokenAmountReceivedMantissa": "4e+23",
            "fromToken": {
              "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
              "asset": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20clip-path='url(%23A)'%3e%3cg%20clip-path='url(%23B)'%3e%3cpath%20fill-rule='evenodd'%20d='M12%200a12%2012%200%201%201%200%2024%2012%2012%200%201%201%200-24z'%20fill='%23f0b90b'/%3e%3cg%20fill='%23fff'%3e%3cpath%20d='M6.595%2012l.009%203.173L9.3%2016.76v1.858l-4.274-2.507v-5.039L6.595%2012zm0-3.173v1.849l-1.57-.929V7.898l1.57-.929%201.578.929-1.578.929zm3.831-.929l1.57-.929%201.578.929-1.578.929-1.57-.929zM7.73%2014.515v-1.858l1.57.929v1.849l-1.57-.92zm2.696%202.91l1.57.929%201.578-.929v1.849l-1.578.929-1.57-.929v-1.849zm5.4-9.527l1.57-.929%201.578.929v1.849l-1.578.929V8.827l-1.57-.929zm1.57%207.275L17.405%2012l1.57-.929v5.038l-4.274%202.507v-1.858l2.695-1.586zm-1.126-.658l-1.57.92v-1.849l1.57-.929v1.858zm0-5.03l.009%201.858-2.704%201.587v3.181l-1.57.92-1.57-.92V12.93l-2.704-1.587V9.485l1.577-.929%202.687%201.594%202.704-1.594%201.578.929h-.007zM7.73%206.313l4.266-2.515%204.274%202.515-1.57.929-2.704-1.594L9.3%207.241l-1.57-.929z'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='A'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3cclipPath%20id='B'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
              "decimals": 18,
              "isNative": true,
              "symbol": "BNB",
            },
            "fromTokenAmountSoldMantissa": "2e+23",
            "minimumToTokenAmountReceivedMantissa": "3e+23",
            "priceImpactPercentage": 0.001,
            "routePath": [
              "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
              "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
            ],
            "toToken": {
              "address": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
              "asset": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20clip-path='url(%23A)'%3e%3ccircle%20cx='12'%20cy='12'%20r='12'%20fill='%23f0b90b'/%3e%3cg%20fill='%23fff'%3e%3cpath%20d='M11.971%202.4l2.372%202.429L8.371%2010.8%206%208.429%2011.971%202.4zm3.6%203.6l2.372%202.429L8.371%2018%206%2015.629%2015.571%206zm-10.8%203.6l2.371%202.429L4.771%2014.4%202.4%2012.029%204.771%209.6zm14.401%200l2.371%202.429-9.571%209.572L9.6%2019.229%2019.172%209.6z'/%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='A'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
              "decimals": 18,
              "symbol": "BUSD",
            },
          },
        },
      ]
    `);
  });
});
