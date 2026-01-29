import type { UseQueryOptions } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/react';
import { type Token, chains } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import {
  type GetSwapQuoteInput,
  type TrimmedGetSwapQuoteInput,
  useGetSwapQuote,
  useRepayWithCollateral,
} from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { VError } from 'libs/errors';
import { en } from 'libs/translations';
import {
  checkSubmitButtonIsDisabled,
  checkSubmitButtonIsEnabled,
} from 'pages/Market/OperationForm/__testUtils__/checkFns';
import { renderComponent } from 'testUtils/render';
import { type Asset, ChainId, type SwapQuote } from 'types';
import { convertTokensToMantissa } from 'utilities';
import { RepayWithCollateralForm } from '..';
import { fakeAsset, fakePool } from '../../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('hooks/useTokenApproval');

const fakeRepaidAsset = fakeAsset;
const fakeCollateralAsset = fakePool.assets[2];

const sharedSwapQuoteProps = {
  priceImpactPercentage: 0.1,
  fromToken: fakeCollateralAsset.vToken.underlyingToken as Token,
  toToken: fakeRepaidAsset.vToken.underlyingToken as Token,
  callData: '0x' as Address,
  fromTokenAmountSoldMantissa: BigInt(
    convertTokensToMantissa({
      value: fakeCollateralAsset.userSupplyBalanceTokens,
      token: fakeCollateralAsset.vToken.underlyingToken,
    }).toFixed(),
  ),
  expectedToTokenAmountReceivedMantissa: BigInt(
    convertTokensToMantissa({
      value: fakeRepaidAsset.userBorrowBalanceTokens.minus(1),
      token: fakeCollateralAsset.vToken.underlyingToken,
    }).toFixed(),
  ),
  minimumToTokenAmountReceivedMantissa: BigInt(
    convertTokensToMantissa({
      value: fakeRepaidAsset.userBorrowBalanceTokens.minus(2),
      token: fakeRepaidAsset.vToken.underlyingToken,
    }).toFixed(),
  ),
};

const fakeExactInSwapQuote: SwapQuote = {
  ...sharedSwapQuoteProps,
  direction: 'exact-in',
};

const fakeApproximateOutSwapQuote: SwapQuote = {
  ...sharedSwapQuoteProps,
  direction: 'approximate-out',
};

const mockRepayWithCollateral = vi.fn();

const getLastUseGetSwapQuoteCallArgs = () =>
  (useGetSwapQuote as Mock).mock.calls[(useGetSwapQuote as Mock).mock.calls.length - 1];

describe('RepayWithCollateralForm', () => {
  beforeEach(() => {
    (useRepayWithCollateral as Mock).mockImplementation(() => ({
      mutateAsync: mockRepayWithCollateral,
    }));

    (useGetSwapQuote as Mock).mockImplementation(
      (input: TrimmedGetSwapQuoteInput, { enabled }: UseQueryOptions) => ({
        isLoading: false,
        data: enabled
          ? {
              swapQuote:
                input.direction === 'exact-in' ? fakeExactInSwapQuote : fakeApproximateOutSwapQuote,
            }
          : undefined,
      }),
    );

    (useSimulateBalanceMutations as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: fakePool,
      },
    }));
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <RepayWithCollateralForm pool={fakePool} asset={fakeRepaidAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();

    // Check inputs are disabled
    expect(
      getByTestId(
        getTokenTextFieldTestId({ parentTestId: TEST_IDS.selectCollateralTokenTextField }),
      ).closest('input'),
    ).toBeDisabled();

    expect(getByTestId(TEST_IDS.selectRepaidTokenTextField).closest('input')).toBeDisabled();
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { getByText, getByTestId } = renderComponent(
      <RepayWithCollateralForm pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
        accountChainId: ChainId.ARBITRUM_ONE,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(selectTokenTextField, { target: { value: 1 } });

    // Check "Switch chain" button is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.switchChain.switchButton.replace('{{chainName}}', chains[ChainId.BSC_TESTNET].name),
        ),
      ).toBeInTheDocument(),
    );
  });

  it('displays correct available collateral amount', async () => {
    const { getByTestId } = renderComponent(
      <RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(getByTestId(TEST_IDS.availableAmount).textContent).toMatchSnapshot();
  });

  it('disables submit button if form is empty', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      data: undefined,
    }));

    renderComponent(<RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />, {
      accountAddress: fakeAccountAddress,
    });

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount entered in collateral input is higher than available amount', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      data: undefined,
    }));

    const { getByText, getByTestId, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeCollateralAsset.vToken.underlyingToken,
    });

    const incorrectValueTokens = fakeCollateralAsset.userSupplyBalanceTokens.plus(1).toFixed();

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(selectTokenTextField, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount entered in repaid input is higher than user repay balance', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      data: undefined,
    }));

    const { getByText, getByTestId, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeCollateralAsset.vToken.underlyingToken,
    });

    const incorrectValueTokens = fakeRepaidAsset.userBorrowBalanceTokens.plus(1).toFixed();

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.selectRepaidTokenTextField));

    // Enter amount in input
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanBorrowBalance)).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if swap would attempt to repay more than borrow balance of user', async () => {
    const customFakeSwapQuote: SwapQuote = {
      ...fakeExactInSwapQuote,
      expectedToTokenAmountReceivedMantissa: BigInt(
        convertTokensToMantissa({
          value: fakeRepaidAsset.userBorrowBalanceTokens.plus(1),
          token: fakeRepaidAsset.vToken.underlyingToken,
        }).toFixed(),
      ),
    };

    (useGetSwapQuote as Mock).mockImplementation((_fn, { enabled }: UseQueryOptions) => ({
      isLoading: false,
      data: enabled
        ? {
            swapQuote: customFakeSwapQuote,
          }
        : undefined,
    }));

    const { getByText, getByTestId, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeCollateralAsset.vToken.underlyingToken,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(selectTokenTextField, {
      target: { value: 1 },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanBorrowBalance)).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disabled submit button if no swap was found', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      data: undefined,
      error: new VError({ type: 'swapQuote', code: 'noSwapQuoteFound' }),
    }));

    const { getByText, getByTestId } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(selectTokenTextField, {
      target: { value: 1 },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.noSwapQuoteFound)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if position would liquidate user', async () => {
    (useSimulateBalanceMutations as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: {
          ...fakePool,
          userHealthFactor: HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
        },
      },
    }));

    const { getByTestId, getByText } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(selectTokenTextField, {
      target: { value: 1 },
    });

    // Check warning is displayed
    await waitFor(() => expect(getByText(en.operationForm.error.tooRisky)).toBeInTheDocument());

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if price impact is too high', async () => {
    const customFakeSwapQuote: SwapQuote = {
      ...fakeExactInSwapQuote,
      priceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        swapQuote: customFakeSwapQuote,
      },
    }));

    const { getByTestId, getByText } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(selectTokenTextField, {
      target: { value: 1 },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.priceImpactTooHigh)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('prompts user to acknowledge high price impact', async () => {
    const customFakeSwapQuote: SwapQuote = {
      ...fakeExactInSwapQuote,
      priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        swapQuote: customFakeSwapQuote,
      },
    }));

    const { getByTestId, getByText, getByRole } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(selectTokenTextField, {
      target: { value: 10 },
    });

    // Check warning is displayed
    expect(
      getByText(
        en.operationForm.acknowledgements.highPriceImpact.tooltip.replace(
          '{{priceImpactPercentage}}',
          `${HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE}`,
        ),
      ),
    );

    // Check submit button is disabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.repay),
    );
    expect(submitButton).toBeDisabled();

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    fireEvent.click(toggle);

    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('prompts user to acknowledge risk if position would lower health factor to risky threshold', async () => {
    (useSimulateBalanceMutations as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: {
          ...fakePool,
          userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.01,
        },
      },
    }));

    const { getByText, getByTestId, getByRole } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(selectTokenTextField, {
      target: { value: 1 },
    });

    // Check warning is displayed
    expect(getByText(en.operationForm.acknowledgements.riskyOperation.tooltip));

    // Check submit button is disabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.repay),
    );
    expect(submitButton).toBeDisabled();

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    fireEvent.click(toggle);

    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('updates form correctly when clicking on MAX button', async () => {
    const expectedFromTokenAmountSoldTokens = fakeCollateralAsset.userSupplyBalanceTokens.minus(10);

    const customFakeSwapQuote: SwapQuote = {
      fromToken: fakeCollateralAsset.vToken.underlyingToken,
      toToken: fakeRepaidAsset.vToken.underlyingToken,
      direction: 'approximate-out',
      priceImpactPercentage: 0.1,
      fromTokenAmountSoldMantissa: BigInt(
        convertTokensToMantissa({
          value: expectedFromTokenAmountSoldTokens,
          token: fakeCollateralAsset.vToken.underlyingToken,
        }).toFixed(),
      ),
      minimumToTokenAmountReceivedMantissa: BigInt(
        convertTokensToMantissa({
          value: fakeRepaidAsset.userBorrowBalanceTokens,
          token: fakeCollateralAsset.vToken.underlyingToken,
        }).toFixed(),
      ),
      expectedToTokenAmountReceivedMantissa: BigInt(
        convertTokensToMantissa({
          value: fakeRepaidAsset.userBorrowBalanceTokens.plus(1),
          token: fakeCollateralAsset.vToken.underlyingToken,
        }).toFixed(),
      ),
      callData: '0x',
    };

    (useGetSwapQuote as Mock).mockImplementation((input: GetSwapQuoteInput) => ({
      isLoading: false,
      data: {
        swapQuote: input.direction === 'exact-in' ? fakeExactInSwapQuote : customFakeSwapQuote,
      },
    }));

    const { getByText, getByTestId, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeCollateralAsset.vToken.underlyingToken,
    });

    // Press on max button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Check inputs were updated accordingly
    const selectCollateralTokenTextField = getByTestId(
      getTokenTextFieldTestId({ parentTestId: TEST_IDS.selectCollateralTokenTextField }),
    ).closest('input');

    await waitFor(() =>
      expect(selectCollateralTokenTextField?.value).toBe(
        expectedFromTokenAmountSoldTokens.toFixed(),
      ),
    );

    const selectRepaidTokenTextField = getByTestId(TEST_IDS.selectRepaidTokenTextField).closest(
      'input',
    );

    await waitFor(() =>
      expect(selectRepaidTokenTextField?.value).toBe(
        fakeRepaidAsset.userBorrowBalanceTokens.toFixed(),
      ),
    );

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.repay,
    });
  });

  it('updates swap direction correctly when updating collateral input value', async () => {
    const { getByTestId } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Update collateral input value
    const collateralTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(collateralTokenInput, {
      target: { value: 1 },
    });

    await waitFor(() =>
      expect(getLastUseGetSwapQuoteCallArgs()[0]).toMatchInlineSnapshot(`
        {
          "direction": "exact-in",
          "fromToken": {
            "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-xvs-asset",
            "symbol": "XVS",
          },
          "fromTokenAmountTokens": "1",
          "recipientAddress": "0xfakeLeverageManagerContractAddress",
          "slippagePercentage": 0.5,
          "toToken": {
            "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-xvs-asset",
            "symbol": "XVS",
          },
        }
      `),
    );
  });

  it('updates swap direction correctly when updating repaid input value', async () => {
    const { getByTestId } = renderComponent(
      <RepayWithCollateralForm asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Update repaid input value
    const repaidTokenInput = getByTestId(TEST_IDS.selectRepaidTokenTextField) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(repaidTokenInput, {
      target: { value: 1 },
    });

    await waitFor(() =>
      expect(getLastUseGetSwapQuoteCallArgs()[0]).toMatchInlineSnapshot(`
        {
          "direction": "approximate-out",
          "fromToken": {
            "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-xvs-asset",
            "symbol": "XVS",
          },
          "minToTokenAmountTokens": "1",
          "recipientAddress": "0xfakeLeverageManagerContractAddress",
          "slippagePercentage": 0.5,
          "toToken": {
            "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-xvs-asset",
            "symbol": "XVS",
          },
        }
      `),
    );
  });

  it('lets user repay partial loan using a swap', async () => {
    const { getByTestId, getByText, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeCollateralAsset.vToken.underlyingToken,
    });

    // Update collateral input value
    const collateralTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(collateralTokenInput, {
      target: { value: 1 },
    });

    await waitFor(() => expect(getLastUseGetSwapQuoteCallArgs()[0]).toMatchSnapshot());

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    await waitFor(() => expect(mockRepayWithCollateral).toHaveBeenCalledTimes(1));
    expect(mockRepayWithCollateral.mock.calls[0]).toMatchSnapshot();
  });

  it('lets user repay partial loan using the same collateral and repaid market', async () => {
    const { getByTestId, getByText, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeRepaidAsset.vToken.underlyingToken,
    });

    // Update collateral input value
    const collateralTokenInput = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectCollateralTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter amount in input
    fireEvent.change(collateralTokenInput, {
      target: { value: 1 },
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    await waitFor(() => expect(mockRepayWithCollateral).toHaveBeenCalledTimes(1));
    expect(mockRepayWithCollateral.mock.calls[0]).toMatchSnapshot();
  });

  it('lets user repay full loan using a swap', async () => {
    const { getByText, container } = renderComponent(
      <RepayWithCollateralForm asset={fakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: fakeCollateralAsset.vToken.underlyingToken,
    });

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    await waitFor(() => expect(getLastUseGetSwapQuoteCallArgs()[0]).toMatchSnapshot());

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    await waitFor(() => expect(mockRepayWithCollateral).toHaveBeenCalledTimes(1));
    expect(mockRepayWithCollateral.mock.calls[0]).toMatchSnapshot();
  });

  it('lets user repay full loan using the same collateral and repaid market', async () => {
    const customFakeRepaidAsset: Asset = {
      ...fakeRepaidAsset,
      userBorrowBalanceTokens: new BigNumber(1),
    };

    const { getByText, container } = renderComponent(
      <RepayWithCollateralForm asset={customFakeRepaidAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectCollateralTokenTextField,
      token: customFakeRepaidAsset.vToken.underlyingToken,
    });

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.repay));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.repay));

    await waitFor(() => expect(mockRepayWithCollateral).toHaveBeenCalledTimes(1));
    expect(mockRepayWithCollateral.mock.calls[0]).toMatchSnapshot();
  });
});
