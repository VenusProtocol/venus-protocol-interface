import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';
import { type Asset, type BalanceMutation, ChainId, type Pool } from 'types';

import { chains } from '@venusprotocol/chains';
import { useBorrow } from 'clients/api';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import BorrowForm from '..';
import { checkSubmitButtonIsDisabled } from '../../__testUtils__/checkFns';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

const buildPoolWithUpdatedAsset = ({
  pool,
  updatedAsset,
}: {
  pool: Pool;
  updatedAsset: Asset;
}): Pool => ({
  ...pool,
  assets: pool.assets.map(asset =>
    asset.vToken.address === updatedAsset.vToken.address ? updatedAsset : asset,
  ),
});

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
        borrowCapTokens: new BigNumber(100),
        borrowBalanceTokens: new BigNumber(10),
      },
      pool: fakePool,
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
        liquidityCents: new BigNumber(50),
      },
      pool: fakePool,
    },
  ],
] as const;

describe('BorrowForm', () => {
  beforeEach(() => {
    (useSimulateBalanceMutations as Mock).mockImplementation(() => ({
      isLoading: false,
      data: undefined,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />);
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
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
        <BorrowForm asset={asset} pool={pool} onSubmitSuccess={noop} />,
        {
          accountAddress: fakeAccountAddress,
        },
      );

      expect(getByTestId(TEST_IDS.availableAmount).textContent).toMatchSnapshot();
    },
  );

  it.each(testCases)(
    'updates input value correctly when clicking on max button and %s is the limiting factor',
    async (_, { asset, pool }) => {
      const { getByText, getByTestId } = renderComponent(
        <BorrowForm asset={asset} pool={pool} onSubmitSuccess={noop} />,
        {
          accountAddress: fakeAccountAddress,
        },
      );

      // Check input is empty
      const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
      expect(input.value).toBe('');

      // Press on max button
      fireEvent.click(getByText(en.operationForm.safeMaxButtonLabel));

      await waitFor(() => expect(input.value).toMatchSnapshot());
    },
  );

  it('disables form and displays a warning notice if the borrow cap of this market has been reached', async () => {
    const customFakeAsset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(100),
    };
    const customFakePool = buildPoolWithUpdatedAsset({
      pool: fakePool,
      updatedAsset: customFakeAsset,
    });

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
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
      <BorrowForm asset={fakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
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

  it('disables submit button and displays a warning notice if an amount entered is higher than asset liquidity', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(200),
      cashTokens: new BigNumber(2),
    };
    const customFakePool = buildPoolWithUpdatedAsset({
      pool: fakePool,
      updatedAsset: customFakeAsset,
    });

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
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

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.borrow),
    );
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button and displays a warning notice if an amount entered is higher than asset borrow cap', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(10),
    };
    const customFakePool = buildPoolWithUpdatedAsset({
      pool: fakePool,
      updatedAsset: customFakeAsset,
    });

    const customFakeSimulatedPool: Pool = buildPoolWithUpdatedAsset({
      pool: customFakePool,
      updatedAsset: {
        ...customFakeAsset,
        borrowBalanceTokens: customFakeAsset.borrowCapTokens.plus(1),
      },
    });

    (useSimulateBalanceMutations as Mock).mockImplementation(
      ({ balanceMutations }: { balanceMutations: BalanceMutation[] }) => ({
        isLoading: false,
        data: {
          pool:
            balanceMutations.filter(b => b.amountTokens.isGreaterThan(0)).length > 0
              ? customFakeSimulatedPool
              : undefined,
        },
      }),
    );

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
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

  it('disables submit button if amount to borrow requested would make user borrow balance go higher than their borrow limit', async () => {
    const { getByTestId, getByText } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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

  it('disables submit button if amount to borrow requested would liquidate user', async () => {
    const { getByTestId, getByText } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
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

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
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

  it('prompts user to acknowledge risk if requested borrow lowers health factor to risky threshold', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.01,
    };

    (useSimulateBalanceMutations as Mock).mockImplementation(
      ({ balanceMutations }: { balanceMutations: BalanceMutation[] }) => ({
        isLoading: false,
        data: {
          pool:
            balanceMutations.filter(b => b.amountTokens.isGreaterThan(0)).length > 0
              ? customFakePool
              : undefined,
        },
      }),
    );

    const { getByText, getByTestId, getByRole } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const marginWithRiskyThresholdTokens = fakePool
      .userLiquidationThresholdCents!.div(HEALTH_FACTOR_MODERATE_THRESHOLD - 0.01)
      .minus(fakePool.userBorrowBalanceCents!)
      .plus(1)
      // Convert cents to tokens
      .dividedBy(fakeAsset.tokenPriceCents)
      .toFixed(0, BigNumber.ROUND_CEIL);

    // Enter amount in input
    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );
    fireEvent.change(tokenTextInput, {
      target: { value: marginWithRiskyThresholdTokens },
    });

    await waitFor(() => expect(tokenTextInput.value).toBe(marginWithRiskyThresholdTokens));

    const expectedBalanceMutations: BalanceMutation[] = [
      {
        type: 'asset',
        action: 'borrow',
        vTokenAddress: fakeAsset.vToken.address,
        amountTokens: new BigNumber(marginWithRiskyThresholdTokens),
      },
    ];

    expect(useSimulateBalanceMutations).toHaveBeenCalledWith({
      pool: fakePool,
      balanceMutations: expectedBalanceMutations,
    });

    // Check warning is displayed
    expect(getByText(en.operationForm.acknowledgements.riskyOperation.tooltip));

    // Check submit button is disabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.borrow),
    );
    expect(submitButton).toBeDisabled();

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    fireEvent.click(toggle);

    await waitFor(() => expect(document.querySelector('button[type="submit"]')).toBeEnabled());
  });

  it('lets user borrow tokens then calls onClose callback on success', async () => {
    const mockBorrow = vi.fn();
    (useBorrow as Mock).mockImplementation(() => ({
      mutateAsync: mockBorrow,
      isPending: false,
    }));

    const onCloseMock = vi.fn();

    const { getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Enter amount in input
    const correctAmountTokens = 1n;
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: correctAmountTokens },
    });

    const expectedBalanceMutations: BalanceMutation[] = [
      {
        type: 'asset',
        action: 'borrow',
        vTokenAddress: fakeAsset.vToken.address,
        amountTokens: new BigNumber(correctAmountTokens.toString()),
      },
    ];

    expect(useSimulateBalanceMutations).toHaveBeenCalledWith({
      pool: fakePool,
      balanceMutations: expectedBalanceMutations,
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.borrow),
    );
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    const expectedAmountMantissa =
      correctAmountTokens * 10n ** BigInt(fakeAsset.vToken.underlyingToken.decimals);

    await waitFor(() => expect(mockBorrow).toHaveBeenCalledTimes(1));
    expect(mockBorrow).toHaveBeenCalledWith({
      amountMantissa: expectedAmountMantissa,
      unwrap: false,
      poolName: fakePool.name,
      poolComptrollerAddress: fakePool.comptrollerAddress,
      vToken: fakeAsset.vToken,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
