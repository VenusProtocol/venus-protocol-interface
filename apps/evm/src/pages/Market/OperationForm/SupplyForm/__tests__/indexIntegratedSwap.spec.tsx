import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTokenBalances, { FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { busd, xvs } from '__mocks__/models/tokens';
import { useSwapTokensAndSupply } from 'clients/api';
import { type GetExactInSwapQuoteInput, useGetSwapQuote } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { useGetSwapTokenUserBalances } from 'hooks/useGetSwapTokenUserBalances';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type {
  Asset,
  AssetBalanceMutation,
  BalanceMutation,
  ExactInSwapQuote,
  Pool,
  SwapQuote,
  TokenBalance,
} from 'types';
import { convertMantissaToTokens } from 'utilities';
import { areTokensEqual, convertTokensToMantissa } from 'utilities';
import Supply from '..';
import {
  checkSubmitButtonIsDisabled,
  checkSubmitButtonIsEnabled,
} from '../../__testUtils__/checkFns';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import SUPPLY_FORM_TEST_IDS from '../testIds';

const fakeBusdWalletBalanceMantissa = new BigNumber(FAKE_BUSD_BALANCE_TOKENS).multipliedBy(
  new BigNumber(10).pow(busd.decimals),
);

const fakeBusdAmountBellowWalletBalanceMantissa = fakeBusdWalletBalanceMantissa.minus(100);

const fakeMarginWithSupplyCapTokens = fakeAsset.supplyCapTokens.minus(
  fakeAsset.supplyBalanceTokens,
);

const fakeMarginWithSupplyCapMantissa = fakeMarginWithSupplyCapTokens.multipliedBy(
  new BigNumber(10).pow(xvs.decimals),
);

const fakeSwapQuote: SwapQuote = {
  fromToken: busd,
  fromTokenAmountSoldMantissa: BigInt(fakeBusdAmountBellowWalletBalanceMantissa.toFixed()),
  toToken: xvs,
  expectedToTokenAmountReceivedMantissa: BigInt(fakeMarginWithSupplyCapMantissa.toFixed()),
  minimumToTokenAmountReceivedMantissa: BigInt(fakeMarginWithSupplyCapMantissa.toFixed()),
  priceImpactPercentage: 0.1,
  direction: 'exact-in',
  callData: '0x',
};

vi.mock('hooks/useGetSwapTokenUserBalances');
vi.mock('hooks/useGetSwapRouterContractAddress');

describe('SupplyForm - Feature flag enabled: integratedSwap', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'integratedSwap',
    );

    (useGetSwapQuote as Mock).mockImplementation(() => (input: GetExactInSwapQuoteInput) => ({
      isLoading: false,
      data: {
        swapQuote: {
          fromToken: input.fromToken,
          toToken: input.toToken,
          direction: 'exact-in',
          priceImpactPercentage: 0.1,
          fromTokenAmountSoldMantissa: BigInt(
            convertTokensToMantissa({
              value: input.fromTokenAmountTokens,
              token: input.fromToken,
            }).toFixed(),
          ),
          expectedToTokenAmountReceivedMantissa: 100000000n,
          minimumToTokenAmountReceivedMantissa: 100000000n,
          callData: '0x',
        },
      },
    }));

    (useGetSwapTokenUserBalances as Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));
  });

  it('disables swap feature when swapAndSupply action of asset is disabled', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      disabledTokenActions: ['swapAndSupply'],
    };

    const { queryByTestId } = renderComponent(<Supply asset={customFakeAsset} pool={fakePool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(queryByTestId(SUPPLY_FORM_TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('displays correct wallet balance', async () => {
    const { getByText, container } = renderComponent(<Supply asset={fakeAsset} pool={fakePool} />, {
      accountAddress: fakeAccountAddress,
    });

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    await waitFor(() => getByText('300K BUSD'));
  });

  it('disables submit button if no amount was entered in input', async () => {
    renderComponent(<Supply asset={fakeAsset} pool={fakePool} />, {
      accountAddress: fakeAccountAddress,
    });

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if no swap is found', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      isLoading: false,
      error: {
        type: 'swapQuote',
        code: 'noSwapQuoteFound',
      },
    }));

    const { getByTestId, container } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount entered in input is higher than wallet balance', async () => {
    const { container, getByTestId } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter invalid amount in input
    const invalidAmount = `${Number(FAKE_BUSD_BALANCE_TOKENS) + 1}`;
    fireEvent.change(selectTokenTextField, { target: { value: invalidAmount } });

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount entered in input would have a higher value than supply cap after swapping', async () => {
    const customFakeSwapQuote: Partial<ExactInSwapQuote> = {
      ...fakeSwapQuote,
      expectedToTokenAmountReceivedMantissa: BigInt(
        fakeMarginWithSupplyCapMantissa.plus(1).toFixed(),
      ),
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: customFakeSwapQuote },
      error: undefined,
      isLoading: false,
    }));

    const fakeSupplyBalanceTokens = fakeAsset.supplyCapTokens
      // Add one token too many
      .plus(1);

    const customFakePool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(a =>
        areTokensEqual(a.vToken, fakeAsset.vToken) ? fakeAsset : a,
      ),
    };

    const fakeSimulatedPool: Pool = {
      ...fakePool,
      assets: customFakePool.assets.map(a => ({
        ...a,
        userSupplyBalanceTokens: areTokensEqual(a.vToken, fakeAsset.vToken)
          ? fakeSupplyBalanceTokens
          : a.userSupplyBalanceTokens,
      })),
    };

    (useSimulateBalanceMutations as Mock).mockImplementation(
      ({ balanceMutations }: { balanceMutations: BalanceMutation[] }) => ({
        isLoading: false,
        data: {
          pool:
            balanceMutations.filter(b => b.amountTokens.isGreaterThan(0)).length > 0
              ? fakeSimulatedPool
              : undefined,
        },
      }),
    );

    const { container, getByTestId, getByText } = renderComponent(
      <Supply asset={fakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter invalid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: FAKE_BUSD_BALANCE_TOKENS } });

    // Check error is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.higherThanSupplyCap
            .replace('{{userMaxSupplyAmount}}', '8.9K XVS')
            .replace('{{assetSupplyCap}}', '10K XVS')
            .replace('{{assetSupplyBalance}}', '1.1K XVS'),
        ),
      ).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
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
      <Supply asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = await waitFor(
      () =>
        getByTestId(
          getTokenTextFieldTestId({
            parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
          }),
        ) as HTMLInputElement,
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    // Check input is empty
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
      <Supply asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = await waitFor(
      () =>
        getByTestId(
          getTokenTextFieldTestId({
            parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
          }),
        ) as HTMLInputElement,
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    // Check input is empty
    expect(selectTokenTextField.value).toBe('');

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() => expect(selectTokenTextField.value).toBe(FAKE_BUSD_BALANCE_TOKENS));

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.supply,
    });
  });

  it('displays warning notice and prompts user to acknowledge high price impact', async () => {
    const customFakeSwapQuote: SwapQuote = {
      ...fakeSwapQuote,
      priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: customFakeSwapQuote },
      isLoading: false,
    }));

    const { container, getByTestId } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button when price impact is too high', async () => {
    const customFakeSwapQuote: SwapQuote = {
      ...fakeSwapQuote,
      priceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: customFakeSwapQuote },
      isLoading: false,
    }));

    const { container, getByTestId, getByText } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.priceImpactTooHigh)).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('lets user swap and supply', async () => {
    (useGetSwapQuote as Mock).mockImplementation(() => ({
      data: { swapQuote: fakeSwapQuote },
      isLoading: false,
    }));

    const mockSwapTokensAndSupply = vi.fn();

    (useSwapTokensAndSupply as Mock).mockImplementation(() => ({
      mutateAsync: mockSwapTokensAndSupply,
    }));

    const { container, getByText, getByTestId } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const selectTokenTextField = await waitFor(
      () =>
        getByTestId(
          getTokenTextFieldTestId({
            parentTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
          }),
        ) as HTMLInputElement,
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    // Check generated balance mutations are accurate
    const expectedBalanceMutations: AssetBalanceMutation[] = [
      {
        type: 'asset',
        action: 'supply',
        vTokenAddress: fakeAsset.vToken.address,
        amountTokens: convertMantissaToTokens({
          token: fakeSwapQuote.toToken,
          value: fakeSwapQuote.expectedToTokenAmountReceivedMantissa,
        }),
      },
    ];

    expect(useSimulateBalanceMutations).toHaveBeenCalledWith({
      pool: fakePool,
      balanceMutations: expectedBalanceMutations,
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.supply));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.supply));

    await waitFor(() => expect(mockSwapTokensAndSupply).toHaveBeenCalledTimes(1));
    expect(mockSwapTokensAndSupply).toHaveBeenCalledWith({
      swapQuote: fakeSwapQuote,
    });
  });
});
