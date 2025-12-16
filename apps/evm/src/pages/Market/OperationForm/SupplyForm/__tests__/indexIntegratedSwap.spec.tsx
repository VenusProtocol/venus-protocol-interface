import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTokenBalances, { FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { bnb, busd, wbnb, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useSwapTokensAndSupply } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import type { Asset, AssetBalanceMutation, Swap, TokenBalance } from 'types';

import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { convertMantissaToTokens } from 'utilities';
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

const fakeSwap: Swap = {
  fromToken: busd,
  fromTokenAmountSoldMantissa: fakeBusdAmountBellowWalletBalanceMantissa,
  toToken: xvs,
  expectedToTokenAmountReceivedMantissa: fakeMarginWithSupplyCapMantissa,
  minimumToTokenAmountReceivedMantissa: fakeMarginWithSupplyCapMantissa,
  exchangeRate: fakeMarginWithSupplyCapMantissa.div(fakeBusdAmountBellowWalletBalanceMantissa),
  routePath: [busd.address, xvs.address],
  priceImpactPercentage: 0.001,
  direction: 'exactAmountIn',
};

vi.mock('hooks/useGetSwapTokenUserBalances');
vi.mock('hooks/useGetSwapInfo');
vi.mock('hooks/useGetSwapRouterContractAddress');
vi.mock('../../useCommonValidation');

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
      <Supply asset={customFakeAsset} pool={fakePool} />,
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

  it('lets user swap and supply', async () => {
    (useGetSwapInfo as Mock).mockImplementation(() => ({
      swap: fakeSwap,
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
          token: fakeSwap.toToken,
          value: fakeSwap.expectedToTokenAmountReceivedMantissa,
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
      swap: fakeSwap,
    });
  });
});
