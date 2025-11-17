import { fireEvent, waitFor } from '@testing-library/react';
import { chains } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { type GetExactInSwapQuoteInput, useGetSwapQuote } from 'clients/api';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { type Asset, ChainId, type Pool } from 'types';
import { convertTokensToMantissa } from 'utilities';
import BoostForm from '..';
import { checkSubmitButtonIsDisabled } from '../../__testUtils__/checkFns';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

const testCases = [
  [
    'user borrow limit',
    {
      asset: fakeAsset,
      pool: fakePool,
    },
  ],
  [
    'asset borrow cap',
    {
      asset: {
        ...fakeAsset,
        borrowCapTokens: new BigNumber(1000),
        borrowBalanceTokens: new BigNumber(10),
        cashTokens: new BigNumber(500000),
      },
      pool: {
        ...fakePool,
        userBorrowLimitCents: new BigNumber(1000000000),
        userBorrowBalanceCents: new BigNumber(99),
      },
    },
  ],

  [
    'user health factor',
    {
      asset: fakeAsset,
      pool: {
        ...fakePool,
        userLiquidationThresholdCents: new BigNumber(105),
        userBorrowLimitCents: new BigNumber(100),
        userBorrowBalanceCents: new BigNumber(99),
      },
    },
  ],
  [
    'asset liquidity',
    {
      asset: {
        ...fakeAsset,
        cashTokens: new BigNumber(1),
      },
      pool: fakePool,
    },
  ],
] as const;

vi.mock('hooks/useSimulateBalanceMutations', () => ({
  useSimulateBalanceMutations: vi.fn(() => ({
    isLoading: false,
    data: {
      pool: fakePool,
    },
  })),
}));

describe('BoostForm', () => {
  beforeEach(() => {
    (useGetSwapQuote as Mock).mockImplementation((input: GetExactInSwapQuoteInput) => ({
      isLoading: false,
      data: {
        swapQuote: {
          fromToken: input.fromToken,
          toToken: input.toToken,
          direction: 'exact-in',
          priceImpactPercentage: 0.1,
          fromTokenAmountSoldMantissa: convertTokensToMantissa({
            value: input.fromTokenAmountTokens,
            token: input.fromToken,
          }),
          expectedToTokenAmountReceivedMantissa: new BigNumber('100000000'),
          minimumToTokenAmountReceivedMantissa: new BigNumber('100000000'),
        },
      },
    }));
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BoostForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();
  });

  it.each(testCases)(
    'renders correct available amount when %s is the limiting factor',
    async (_, { asset, pool }) => {
      const { getByTestId } = renderComponent(
        <BoostForm asset={asset} pool={pool} onSubmitSuccess={noop} />,
        {
          accountAddress: fakeAccountAddress,
        },
      );

      expect(getByTestId(TEST_IDS.availableAmount).textContent).toMatchSnapshot();
    },
  );

  it('disables form and displays a warning notice if the borrow cap of this market has been reached', async () => {
    const customFakeAsset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <BoostForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(en.operationForm.error.borrowCapReached.replace('{{assetBorrowCap}}', '100 XVS')),
      ).toBeInTheDocument(),
    );

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();

    await checkSubmitButtonIsDisabled();
  });

  it('disables form and displays a warning notice if user has not supplied and collateralize any tokens yet', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowLimitCents: new BigNumber(0),
      userBorrowBalanceCents: new BigNumber(0),
      assets: fakePool.assets.map(asset => ({
        ...asset,
        isCollateralOfUser: false,
      })),
    };

    const { getByText } = renderComponent(
      <BoostForm asset={fakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.noCollateral.replace(
            '{{tokenSymbol}}',
            fakeAsset.vToken.underlyingToken.symbol,
          ),
        ),
      ).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button and displays a warning notice if borrow amount entered is higher than asset liquidity', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(200),
    };

    const { getByText, getByTestId } = renderComponent(
      <BoostForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = new BigNumber(customFakeAsset.liquidityCents)
      .dividedBy(customFakeAsset.tokenPriceCents)
      // Add one token more than the available liquidity
      .plus(1)
      .dp(customFakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableLiquidity)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button and displays a warning notice if borrow amount entered is higher than asset borrow cap', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(10),
    };

    const { getByText, getByTestId } = renderComponent(
      <BoostForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = new BigNumber(customFakeAsset.borrowCapTokens!)
      .minus(customFakeAsset.borrowBalanceTokens)
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.higherThanBorrowCap
            .replace('{{userMaxBorrowAmount}}', '90 XVS')
            .replace('{{assetBorrowCap}}', '100 XVS')
            .replace('{{assetBorrowBalance}}', '10 XVS'),
        ),
      ).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if position would make user borrow balance go higher than their borrow limit', async () => {
    const { getByTestId, getByText } = renderComponent(
      <BoostForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = fakePool
      .userBorrowLimitCents!.minus(fakePool.userBorrowBalanceCents!)
      .dividedBy(fakeAsset.tokenPriceCents)
      // Convert cents to tokens
      // Add one token more than the maximum
      .plus(1)
      .dp(fakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if position would liquidate user', async () => {
    const { getByTestId, getByText } = renderComponent(
      <BoostForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = fakePool
      .userLiquidationThresholdCents!.minus(fakePool.userBorrowBalanceCents!)
      .plus(1)
      // Convert cents to tokens
      .dividedBy(fakeAsset.tokenPriceCents)
      .toFixed(0, BigNumber.ROUND_CEIL);

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount to supply to open position is higher than asset supply cap', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      supplyCapTokens: new BigNumber(1000),
      supplyBalanceTokens: new BigNumber(999),
    };

    const { getByTestId } = renderComponent(
      <BoostForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Enter amount in input
    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );
    fireEvent.change(tokenTextInput, {
      target: { value: 100 },
    });

    await waitFor(() => expect(tokenTextInput.value).toEqual('100'));

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BoostForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
        accountChainId: ChainId.ARBITRUM_ONE,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const correctAmountTokens = 1;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Check "Switch chain" button is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.switchChain.switchButton.replace('{{chainName}}', chains[ChainId.BSC_TESTNET].name),
        ),
      ).toBeInTheDocument(),
    );
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
      <BoostForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Enter amount in input
    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );
    fireEvent.change(tokenTextInput, {
      target: { value: 10 },
    });

    await waitFor(() => expect(tokenTextInput.value).toEqual('10'));

    // Check warning is displayed
    expect(getByText(en.operationForm.riskyOperation.warning));

    // Check submit button is disabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.boost),
    );
    expect(submitButton).toBeDisabled();

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    fireEvent.click(toggle);

    await waitFor(() => expect(document.querySelector('button[type="submit"]')).toBeEnabled());
  });

  it.todo('lets user open a leveraged position');
});
