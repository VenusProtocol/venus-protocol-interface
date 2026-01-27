import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTokenBalances, { FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { bnb, busd, wbnb, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useSwapTokensAndSupply } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import type {
  Asset,
  BalanceMutation,
  ExactInSwapQuote,
  Pool,
  SwapQuote,
  TokenBalance,
} from 'types';

import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { areTokensEqual } from 'utilities';
import Supply from '..';
import OPERATION_DETAILS_TEST_IDS from '../../OperationDetails/testIds';
import SWAP_SUMMARY_TEST_IDS from '../../SwapSummary/testIds';
import {
  checkSubmitButtonIsDisabled,
  checkSubmitButtonIsEnabled,
} from '../../__testUtils__/checkFns';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import SUPPLY_FORM_TEST_IDS from '../testIds';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

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

const fakeSwap: SwapQuote = {
  fromToken: busd,
  fromTokenAmountSoldMantissa: BigInt(
    fakeBusdAmountBellowWalletBalanceMantissa.integerValue().toString(),
  ),
  toToken: xvs,
  expectedToTokenAmountReceivedMantissa: BigInt(
    fakeMarginWithSupplyCapMantissa.integerValue().toString(),
  ),
  minimumToTokenAmountReceivedMantissa: BigInt(
    fakeMarginWithSupplyCapMantissa.integerValue().toString(),
  ),
  // exchangeRate: fakeMarginWithSupplyCapMantissa.div(fakeBusdAmountBellowWalletBalanceMantissa),
  // routePath: [busd.address, xvs.address],
  priceImpactPercentage: 0.001,
  direction: 'exact-in',
  callData: '0x',
};

vi.mock('hooks/useGetSwapTokenUserBalances');
vi.mock('hooks/useGetSwapInfo');
vi.mock('hooks/useGetSwapRouterContractAddress');

describe('SupplyForm - Feature flag enabled: integratedSwap', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'integratedSwap',
    );

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: undefined,
      error: undefined,
      isLoading: false,
    }));

    (useGetSwapTokenUserBalances as Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />);
  });

  it('disables swap feature when swapAndSupply action of asset is disabled', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      disabledTokenActions: ['swapAndSupply'],
    };

    const { queryByTestId } = renderComponent(
      <Supply asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(SUPPLY_FORM_TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('displays correct wallet balance', async () => {
    const { getByText, container } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: busd,
    });

    await waitFor(() => getByText('300K BUSD'));
  });

  it('disables submit button if no amount was entered in input', async () => {
    renderComponent(<Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />, {
      accountAddress: fakeAccountAddress,
    });

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if swap is a wrap', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: undefined,
      error: 'WRAPPING_UNSUPPORTED',
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
      <Supply asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: SUPPLY_FORM_TEST_IDS.selectTokenTextField,
      token: bnb,
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

  it('disables submit button if no swap is found', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: undefined,
      error: 'INSUFFICIENT_LIQUIDITY',
      isLoading: false,
    }));

    const { getByTestId, container } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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
    const customFakeSwap: Partial<ExactInSwapQuote> = {
      ...fakeSwap,
      expectedToTokenAmountReceivedMantissa: BigInt(
        fakeMarginWithSupplyCapMantissa.plus(1).toString(),
      ),
    };

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: customFakeSwap,
      error: undefined,
      isLoading: false,
    }));

    const fakeSupplyBalanceTokens = fakeAsset.supplyCapTokens
      // Add one token too many
      .plus(1);

    const fakeSimulatedPool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(a => ({
        ...a,
        supplyBalanceTokens: areTokensEqual(a.vToken, fakeAsset.vToken)
          ? fakeSupplyBalanceTokens
          : a.supplyBalanceTokens,
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
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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

  it('displays correct swap details', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeSwap,
      error: undefined,
      isLoading: false,
    }));

    const { container, getByTestId, getByText } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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
    fireEvent.change(selectTokenTextField, { target: { value: FAKE_BUSD_BALANCE_TOKENS } });

    await waitFor(() => getByTestId(OPERATION_DETAILS_TEST_IDS.swapDetails));

    // Open swap details accordion
    fireEvent.click(getByText(en.operationForm.swapDetails.label.supply).closest('button')!);

    expect(getByTestId(OPERATION_DETAILS_TEST_IDS.swapDetails).textContent).toMatchSnapshot();
    expect(getByTestId(SWAP_SUMMARY_TEST_IDS.swapSummary).textContent).toMatchSnapshot();
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
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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

  it('displays warning notice and set correct submit button label if the swap has a high price impact', async () => {
    const customFakeSwap: SwapQuote = {
      ...fakeSwap,
      priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: customFakeSwap,
      isLoading: false,
    }));

    const onCloseMock = vi.fn();

    const { container, getByTestId, getByText } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
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

    // Check warning notice is displayed
    await waitFor(() => getByText(en.operationForm.warning.swappingWithHighPriceImpactWarning));

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.supply,
    });
  });

  it('disables submit button when price impact has reached the maximum tolerated', async () => {
    const customFakeSwap: SwapQuote = {
      ...fakeSwap,
      priceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    };

    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: customFakeSwap,
      isLoading: false,
    }));

    const onCloseMock = vi.fn();

    const { container, getByTestId, getByText } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
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

  it('lets user swap and supply then calls onClose callback on success', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeSwap,
      isLoading: false,
    }));

    const mockSwapTokensAndSupply = vi.fn();

    (useSwapTokensAndSupply as Mock).mockImplementation(() => ({
      mutateAsync: mockSwapTokensAndSupply,
    }));

    const onCloseMock = vi.fn();

    const { container, getByText, getByTestId } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
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

    // Click on submit button
    await waitFor(() => getByText(en.operationForm.submitButtonLabel.supply));
    fireEvent.click(getByText(en.operationForm.submitButtonLabel.supply));

    await waitFor(() => expect(mockSwapTokensAndSupply).toHaveBeenCalledTimes(1));
    expect(mockSwapTokensAndSupply).toHaveBeenCalledWith({
      swap: fakeSwap,
    });

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
