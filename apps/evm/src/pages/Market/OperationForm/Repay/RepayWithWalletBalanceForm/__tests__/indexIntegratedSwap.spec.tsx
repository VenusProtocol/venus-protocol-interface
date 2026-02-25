import { fireEvent, waitFor } from '@testing-library/react';
import BigNumberLib from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTokenBalances, { FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { bnb, busd, wbnb, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import {
  type GetApproximateOutSwapQuoteInput,
  type GetSwapQuoteInput,
  useGetSwapQuote,
  useSwapTokensAndRepay,
} from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { FULL_REPAYMENT_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { en } from 'libs/translations';
import type { Asset, SwapQuote, TokenBalance } from 'types';

import {
  checkSubmitButtonIsDisabled,
  checkSubmitButtonIsEnabled,
} from 'pages/Market/OperationForm/__testUtils__/checkFns';
import RepayWithWalletBalanceForm, { PRESET_PERCENTAGES } from '..';
import { fakeAsset, fakePool } from '../../__testUtils__/fakeData';
import REPAY_FORM_TEST_IDS from '../testIds';

vi.mock('hooks/useGetSwapTokenUserBalances');
vi.mock('hooks/useGetSwapRouterContractAddress');

const BigNumber = BigNumberLib.clone({ EXPONENTIAL_AT: 1e9 });

const fakeBusdWalletBalanceMantissa = new BigNumber(FAKE_BUSD_BALANCE_TOKENS).multipliedBy(
  new BigNumber(10).pow(busd.decimals),
);

const fakeBusdAmountBellowWalletBalanceMantissa = fakeBusdWalletBalanceMantissa.minus(100);

const fakeXvsUserBorrowBalanceInMantissa = new BigNumber(
  fakeAsset.userBorrowBalanceTokens,
).multipliedBy(new BigNumber(10).pow(xvs.decimals));

const fakeXvsAmountBelowUserBorrowBalanceMantissa = fakeXvsUserBorrowBalanceInMantissa.minus(100);

const fakeSwap: SwapQuote = {
  fromToken: busd,
  fromTokenAmountSoldMantissa: BigInt(fakeBusdAmountBellowWalletBalanceMantissa.toFixed()),
  toToken: xvs,
  expectedToTokenAmountReceivedMantissa: BigInt(
    fakeXvsAmountBelowUserBorrowBalanceMantissa.toFixed(),
  ),
  minimumToTokenAmountReceivedMantissa: BigInt(
    fakeXvsAmountBelowUserBorrowBalanceMantissa.toFixed(),
  ),
  priceImpactPercentage: 0.001,
  direction: 'exact-in',
  callData: '0x',
};

// Fake full repayment swap in which the wallet balance covers exactly the entire user loan
const fakeFullRepaymentSwap: SwapQuote = {
  fromToken: busd,
  fromTokenAmountSoldMantissa: BigInt(fakeBusdWalletBalanceMantissa.toFixed()),
  toToken: xvs,
  expectedToTokenAmountReceivedMantissa: BigInt(fakeXvsUserBorrowBalanceInMantissa.toFixed()),
  minimumToTokenAmountReceivedMantissa: BigInt(fakeXvsUserBorrowBalanceInMantissa.toFixed()),
  priceImpactPercentage: 0.001,
  direction: 'approximate-out',
  callData: '0x',
};

const mockSwapTokensAndRepay = vi.fn();

describe('RepayWithWalletBalanceForm - Feature flag enabled: integratedSwap', () => {
  beforeEach(() => {
    (useSwapTokensAndRepay as Mock).mockReturnValue({ mutateAsync: mockSwapTokensAndRepay });

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'integratedSwap',
    );

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: fakeSwap },
      error: undefined,
      isLoading: false,
    }));

    (useGetSwapTokenUserBalances as Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));

    (useSimulateBalanceMutations as Mock).mockImplementation(({ pool }) => ({
      isLoading: false,
      data: { pool },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
    );
  });

  it('displays correct wallet balance', async () => {
    const { getByText, container } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    await waitFor(() => getByText('300K BUSD'));
  });

  it('disables submit button if no amount was entered in input', async () => {
    renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if swap is a wrap', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: undefined },
      error: {
        code: 'SWAP_WRAPPING_UNSUPPORTED',
        message: en.operationForm.error.wrappingUnsupported,
      },
      isLoading: false,
    }));

    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: {
        ...fakeAsset.vToken,
        underlyingToken: wbnb,
      },
    };

    const { container, getByTestId } = renderComponent(
      <RepayWithWalletBalanceForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: bnb,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if swap is an unwrap', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: undefined },
      error: {
        code: 'SWAP_UNWRAPPING_UNSUPPORTED',
        message: en.operationForm.error.unwrappingUnsupported,
      },
      isLoading: false,
    }));

    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: {
        ...fakeAsset.vToken,
        underlyingToken: bnb,
      },
    };

    const { container, getByTestId } = renderComponent(
      <RepayWithWalletBalanceForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: wbnb,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if no swap is found', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: undefined },
      error: {
        code: 'noSwapQuoteFound',
        message: en.operationForm.error.noSwapQuoteFound,
      },
      isLoading: false,
    }));

    const { getByTestId, getByText, container } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.noSwapQuoteFound)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount entered in input is higher than wallet balance', async () => {
    const { container, getByTestId, getByText } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter invalid amount in input
    const invalidAmount = `${Number(FAKE_BUSD_BALANCE_TOKENS) + 1}`;
    fireEvent.change(selectTokenTextField, { target: { value: invalidAmount } });

    // Check error is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.higherThanWalletBalance.replace('{{tokenSymbol}}', busd.symbol),
        ),
      ).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount entered in input would have a higher value than repay balance after swapping', async () => {
    const customFakeSwap: SwapQuote = {
      ...fakeSwap,
      expectedToTokenAmountReceivedMantissa: BigInt(
        fakeXvsUserBorrowBalanceInMantissa.plus(1).toFixed(),
      ),
      minimumToTokenAmountReceivedMantissa: BigInt(
        fakeXvsUserBorrowBalanceInMantissa.plus(1).toFixed(),
      ),
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: customFakeSwap },
      error: undefined,
      isLoading: false,
    }));

    const { container, getByTestId, getByText } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter invalid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: FAKE_BUSD_BALANCE_TOKENS } });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanRepayBalance)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('displays warning notice and set correct submit button label if the swap has a high price impact', async () => {
    const customFakeSwap: SwapQuote = {
      ...fakeSwap,
      priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: customFakeSwap },
      isLoading: false,
    }));

    const onCloseMock = vi.fn();

    const { container, getByTestId, getByText } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={onCloseMock}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    // Check warning notice is displayed
    await waitFor(() => getByText(en.operationForm.repay.swappingWithHighPriceImpactWarning));

    // Check submit button label is correct
    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('disables submit button when price impact has reached the maximum tolerated', async () => {
    const customFakeSwap: SwapQuote = {
      ...fakeSwap,
      priceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: customFakeSwap },
      isLoading: false,
    }));

    const onCloseMock = vi.fn();

    const { container, getByTestId, getByText } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={onCloseMock}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.priceImpactTooHigh)).toBeInTheDocument(),
    );

    // Check submit button has the correct label and is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('displays correct swap details', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: fakeSwap },
      error: undefined,
      isLoading: false,
    }));

    const { container, getByTestId, getByText } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: FAKE_BUSD_BALANCE_TOKENS } });

    // Verify swap details are displayed
    await waitFor(() =>
      expect(getByText(en.swapDetails.slippageTolerance.label)).toBeInTheDocument(),
    );
    expect(getByText(en.swapDetails.priceImpact.label)).toBeInTheDocument();
  });

  it('updates input value to 0 when clicking on MAX button if wallet balance is 0', async () => {
    const customFakeTokenBalances: TokenBalance[] = fakeTokenBalances.map(tokenBalance => ({
      ...tokenBalance,
      balanceMantissa:
        tokenBalance.token.address.toLowerCase() === busd.address.toLowerCase()
          ? new BigNumber(0)
          : tokenBalance.balanceMantissa,
    }));

    (useGetSwapTokenUserBalances as Mock).mockImplementation(() => ({
      data: customFakeTokenBalances,
    }));

    const { container, getByText, getByTestId } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() => expect(selectTokenTextField.value).toBe('0'));

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('updates input value to wallet balance when clicking on MAX button', async () => {
    const { container, getByText, getByTestId } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() => expect(selectTokenTextField.value).toBe(FAKE_BUSD_BALANCE_TOKENS));

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('updates input value to correct value when clicking on preset percentage buttons', async () => {
    const exchangeRate = new BigNumber(2);
    const getConvertedFromTokenAmountTokens = (toTokenAmountTokens: BigNumber | string) =>
      new BigNumber(toTokenAmountTokens).dividedBy(exchangeRate);

    // Memoize generate swaps to prevent infinite re-renders on state update
    const memoizedFakeSwaps: { [key: string]: SwapQuote } = {};

    // Generate fake swap info based on amount being swapped to
    const getFakeSwap = (input: GetSwapQuoteInput) => {
      const { minToTokenAmountTokens, direction, fromToken, toToken } =
        input as GetApproximateOutSwapQuoteInput;
      if (minToTokenAmountTokens && memoizedFakeSwaps[minToTokenAmountTokens.toFixed()]) {
        return memoizedFakeSwaps[minToTokenAmountTokens.toFixed()];
      }

      if ((direction as GetSwapQuoteInput['direction']) === 'exact-in' || !minToTokenAmountTokens) {
        return undefined;
      }

      const fakeConvertedFromTokenAmountTokens =
        getConvertedFromTokenAmountTokens(minToTokenAmountTokens);
      const fakeConvertedFromTokenAmountMantissa = fakeConvertedFromTokenAmountTokens.multipliedBy(
        new BigNumber(10).pow(fromToken.decimals),
      );
      const fakeToTokenAmountReceivedMantissa = new BigNumber(minToTokenAmountTokens).multipliedBy(
        new BigNumber(10).pow(toToken.decimals),
      );

      const customFakeSwap: SwapQuote = {
        ...fakeFullRepaymentSwap,
        fromTokenAmountSoldMantissa: BigInt(fakeConvertedFromTokenAmountMantissa.toFixed()),
        expectedToTokenAmountReceivedMantissa: BigInt(fakeToTokenAmountReceivedMantissa.toFixed()),
        minimumToTokenAmountReceivedMantissa: BigInt(fakeToTokenAmountReceivedMantissa.toFixed()),
      };

      memoizedFakeSwaps[minToTokenAmountTokens.toFixed()] = customFakeSwap;
      return customFakeSwap;
    };

    (useGetSwapQuote as Mock).mockImplementation((input: GetSwapQuoteInput) => ({
      data: { swapQuote: getFakeSwap(input) },
      error: undefined,
      isLoading: false,
    }));

    const { container, getByText, getByTestId } = renderComponent(
      <RepayWithWalletBalanceForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    for (let i = 0; i < PRESET_PERCENTAGES.length; i++) {
      // Clear input
      fireEvent.change(selectTokenTextField, {
        target: { value: '' },
      });

      const presetPercentage = PRESET_PERCENTAGES[i];

      // Press on preset percentage button
      fireEvent.click(getByText(`${presetPercentage}%`));

      const percentageWithBuffer =
        presetPercentage === 100
          ? presetPercentage + FULL_REPAYMENT_BUFFER_PERCENTAGE
          : presetPercentage;

      const fakeToTokenAmountRepaidTokens = fakeAsset.userBorrowBalanceTokens
        .multipliedBy(percentageWithBuffer / 100)
        .dp(fakeAsset.vToken.underlyingToken.decimals);

      const fakeConvertedFromTokenAmountTokens = getConvertedFromTokenAmountTokens(
        fakeToTokenAmountRepaidTokens,
      ).dp(busd.decimals);

      expect(selectTokenTextField.value).toBe(fakeConvertedFromTokenAmountTokens.toFixed());
    }
  });

  it('lets user swap and repay partial loan then calls onClose callback on success', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: fakeSwap },
      error: undefined,
      isLoading: false,
    }));

    const onCloseMock = vi.fn();

    const { container, getByTestId, getByText } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={onCloseMock}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    const validAmountTokens = FAKE_BUSD_BALANCE_TOKENS;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: validAmountTokens } });

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    // Check swapTokensAndRepay is called with correct arguments
    await waitFor(() => expect(mockSwapTokensAndRepay).toHaveBeenCalledTimes(1));
    expect(mockSwapTokensAndRepay.mock.calls[0]).toMatchSnapshot();

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });

  it('lets user swap and repay full loan', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: fakeFullRepaymentSwap },
      isLoading: false,
    }));

    const onCloseMock = vi.fn();

    const { container, getByText } = renderComponent(
      <RepayWithWalletBalanceForm
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={onCloseMock}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: REPAY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    // Click on 100% button
    fireEvent.click(getByText('100%'));

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    // Check swapTokensAndRepay is called with correct arguments
    await waitFor(() => expect(mockSwapTokensAndRepay).toHaveBeenCalledTimes(1));
    expect(mockSwapTokensAndRepay.mock.calls[0]).toMatchSnapshot();

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
