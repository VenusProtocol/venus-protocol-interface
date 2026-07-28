import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { AssetBalanceMutation, LiquidityHubBalanceMutation } from 'types';
import { calculateCollateralWithdrawLimits, formatTokensToReadableValue } from 'utilities';

import { SupplyWithCollateralForm, type SupplyWithCollateralFormProps } from '..';

const liquidityHub = liquidityHubs[0];
const corePool = poolData[0];
const corePoolAsset = assetData[0];
const spenderAddress = '0xfakeSpenderAddress000000000000000000000001';

const makeUseTokenApprovalOutput = (overrides: Partial<ReturnType<typeof useTokenApproval>> = {}) =>
  ({
    isTokenApproved: true,
    isWalletSpendingLimitLoading: false,
    isApproveTokenLoading: false,
    isRevokeWalletSpendingLimitLoading: false,
    walletSpendingLimitTokens: new BigNumber(40),
    approveToken: vi.fn().mockResolvedValue(undefined),
    revokeWalletSpendingLimit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as ReturnType<typeof useTokenApproval>;

const baseProps: SupplyWithCollateralFormProps = {
  liquidityHubMigratorContractAddress: spenderAddress,
  corePoolAsset,
  corePool,
  liquidityHub,
};

const clickableLimitPool: SupplyWithCollateralFormProps['corePool'] = {
  ...corePool,
  userBorrowLimitProtectedCents: new BigNumber(100000),
  userBorrowBalanceProtectedCents: new BigNumber(1000),
};

const renderTransactionForm = (
  props: Partial<SupplyWithCollateralFormProps> = {},
  options?: Parameters<typeof renderComponent>[1],
) =>
  renderComponent(<SupplyWithCollateralForm {...baseProps} {...props} />, {
    accountAddress: fakeAccountAddress,
    ...options,
  });

const getAmountInput = () => {
  const input = document.querySelector('input[name="amountTokens"]') as HTMLInputElement | null;

  if (!input) {
    throw new Error('Expected amount input to be rendered');
  }

  return input;
};

describe('SupplyWithCollateralForm', () => {
  const mockUseGetPool = useGetPool as Mock;
  const mockUseSimulatePoolMutations = useSimulatePoolMutations as Mock;
  const mockUseTokenApproval = useTokenApproval as Mock;

  beforeEach(() => {
    mockUseGetPool.mockImplementation(() => ({
      data: {
        pool: corePool,
      },
    }));

    mockUseSimulatePoolMutations.mockImplementation(
      ({ pool }: { pool: SupplyWithCollateralFormProps['corePool'] }) => ({
        data: {
          pool,
        },
      }),
    );

    mockUseTokenApproval.mockReturnValue(makeUseTokenApprovalOutput());
  });

  it('renders the available balance and converted spending limit using the collateral limits', () => {
    const { limitTokens } = calculateCollateralWithdrawLimits({
      asset: corePoolAsset,
      pool: clickableLimitPool,
    });
    const readableLimit = formatTokensToReadableValue({
      value: limitTokens,
      token: liquidityHub.vhToken.underlyingToken,
    });
    const convertedSpendingLimitTokens = new BigNumber(40).div(corePoolAsset.exchangeRateVTokens);
    const readableConvertedSpendingLimit = formatTokensToReadableValue({
      value: convertedSpendingLimitTokens,
      token: corePoolAsset.vToken.underlyingToken,
    });

    renderTransactionForm({
      corePool: clickableLimitPool,
    });

    expect(screen.getByText(en.availableBalance.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: readableLimit })).toBeInTheDocument();
    expect(screen.getByText(en.spendingLimit.label)).toBeInTheDocument();
    expect(screen.getByText(readableConvertedSpendingLimit)).toBeInTheDocument();

    expect(mockUseTokenApproval).toHaveBeenCalledWith({
      token: corePoolAsset.vToken,
      spenderAddress,
      accountAddress: fakeAccountAddress,
    });
  });

  it('fills the input with the collateral withdrawal limit when clicking the available balance', async () => {
    const { limitTokens } = calculateCollateralWithdrawLimits({
      asset: corePoolAsset,
      pool: clickableLimitPool,
    });
    const readableLimit = formatTokensToReadableValue({
      value: limitTokens,
      token: liquidityHub.vhToken.underlyingToken,
    });

    renderTransactionForm({
      corePool: clickableLimitPool,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: readableLimit,
      }),
    );

    await waitFor(() =>
      expect(getAmountInput().value).toBe(limitTokens.dp(liquidityHub.vhToken.decimals).toFixed()),
    );
  });

  it('fills the input with the safe max value when clicking SAFE MAX', async () => {
    const { safeLimitTokens } = calculateCollateralWithdrawLimits({
      asset: corePoolAsset,
      pool: corePool,
    });

    renderTransactionForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.rightSafeMaxButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(getAmountInput().value).toBe(
        safeLimitTokens.dp(liquidityHub.vhToken.decimals).toFixed(),
      ),
    );
  });

  it('submits through the embedded form, resets the amount, and calls onSubmitSuccess', async () => {
    const onSubmitSuccess = vi.fn();

    renderTransactionForm({
      corePool: clickableLimitPool,
      onSubmitSuccess,
    });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '0.5',
      },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplySubmitButtonLabel,
      }),
    );

    await waitFor(() => expect(getAmountInput().value).toBe(''));
    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
  });

  it('shows the approval steps when the collateral token is not approved', async () => {
    mockUseTokenApproval.mockReturnValue(
      makeUseTokenApprovalOutput({
        isTokenApproved: false,
        walletSpendingLimitTokens: new BigNumber(0),
      }),
    );

    renderTransactionForm({
      corePool: clickableLimitPool,
    });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '0.5',
      },
    });

    await waitFor(() => expect(screen.getByText(en.approveTokenSteps.step1)).toBeInTheDocument());
    expect(
      screen.getByRole('button', {
        name: en.approveTokenSteps.approveTokenButton.text.replace(
          '{{tokenSymbol}}',
          corePoolAsset.vToken.symbol,
        ),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(en.approveTokenSteps.step2)).toBeInTheDocument();
  });

  it('disables the available balance action when the collateral withdrawal limit is zero', () => {
    const zeroLimitPool: SupplyWithCollateralFormProps['corePool'] = {
      ...corePool,
      userBorrowLimitProtectedCents: new BigNumber(10),
      userBorrowBalanceProtectedCents: new BigNumber(10),
    };
    const { limitTokens } = calculateCollateralWithdrawLimits({
      asset: corePoolAsset,
      pool: zeroLimitPool,
    });
    const readableLimit = formatTokensToReadableValue({
      value: limitTokens,
      token: liquidityHub.vhToken.underlyingToken,
    });

    renderTransactionForm({
      corePool: zeroLimitPool,
    });

    expect(
      screen.getByRole('button', {
        name: readableLimit,
      }),
    ).toBeDisabled();
  });

  it('shows a validation error when the amount exceeds the converted spending limit', async () => {
    mockUseTokenApproval.mockReturnValue(
      makeUseTokenApprovalOutput({
        walletSpendingLimitTokens: new BigNumber(1),
      }),
    );

    renderTransactionForm({
      corePool: clickableLimitPool,
    });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '1',
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText(en.liquidityHubForm.error.higherThanWalletSpendingLimit),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplySubmitButtonLabel,
      }),
    ).toBeDisabled();
  });

  it('simulates the collateral withdraw and Liquidity Hub supply balance mutations', async () => {
    interface SimulatePoolMutationsInput {
      balanceMutations: Array<AssetBalanceMutation | LiquidityHubBalanceMutation>;
    }

    renderTransactionForm({
      corePool: clickableLimitPool,
    });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '0.5',
      },
    });

    await waitFor(() => {
      const lastCallInput = mockUseSimulatePoolMutations.mock.calls.at(-1)?.[0] as
        | SimulatePoolMutationsInput
        | undefined;
      const assetMutation = lastCallInput?.balanceMutations.find(
        (balanceMutation): balanceMutation is AssetBalanceMutation =>
          balanceMutation.type === 'asset',
      );
      const liquidityHubMutation = lastCallInput?.balanceMutations.find(
        (balanceMutation): balanceMutation is LiquidityHubBalanceMutation =>
          balanceMutation.type === 'liquidityHub',
      );

      expect(assetMutation).toMatchObject({
        action: 'withdraw',
        vTokenAddress: corePoolAsset.vToken.address,
      });
      expect(assetMutation?.amountTokens.isEqualTo('0.5')).toBe(true);
      expect(liquidityHubMutation).toMatchObject({
        action: 'supply',
        vhTokenAddress: liquidityHub.vhToken.address,
      });
      expect(liquidityHubMutation?.amountTokens.isEqualTo('0.5')).toBe(true);
    });
  });
});
