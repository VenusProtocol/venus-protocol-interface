import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetBalanceOf, useGetPool } from 'clients/api';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { BalanceMutation, LiquidityHubBalanceMutation, Pool } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';

import { SupplyWithWalletForm, type SupplyWithWalletFormProps } from '..';

const liquidityHub = liquidityHubs[0];
const underlyingToken = liquidityHub.vhToken.underlyingToken;
const walletBalanceTokens = liquidityHub.userWalletBalanceTokens ?? new BigNumber(0);
const walletBalanceMantissa = convertTokensToMantissa({
  value: walletBalanceTokens,
  token: underlyingToken,
});
const walletSpendingLimitTokens = new BigNumber(40);

const makeUseTokenApprovalOutput = (overrides: Partial<ReturnType<typeof useTokenApproval>> = {}) =>
  ({
    isTokenApproved: true,
    isWalletSpendingLimitLoading: false,
    isApproveTokenLoading: false,
    isRevokeWalletSpendingLimitLoading: false,
    walletSpendingLimitTokens,
    approveToken: vi.fn().mockResolvedValue(undefined),
    revokeWalletSpendingLimit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as ReturnType<typeof useTokenApproval>;

const renderTransactionForm = (
  props: Partial<SupplyWithWalletFormProps> = {},
  options?: Parameters<typeof renderComponent>[1],
) =>
  renderComponent(<SupplyWithWalletForm liquidityHub={liquidityHub} {...props} />, {
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

describe('SupplyWithWalletForm', () => {
  const mockUseGetBalanceOf = useGetBalanceOf as Mock;
  const mockUseGetPool = useGetPool as Mock;
  const mockUseSimulatePoolMutations = useSimulatePoolMutations as Mock;
  const mockUseTokenApproval = useTokenApproval as Mock;

  beforeEach(() => {
    mockUseGetBalanceOf.mockReturnValue({
      data: {
        balanceMantissa: walletBalanceMantissa,
      },
      isLoading: false,
    });

    mockUseGetPool.mockReturnValue({
      data: {
        pool: poolData[0],
      },
      isLoading: false,
    });

    mockUseSimulatePoolMutations.mockImplementation(({ pool }: { pool?: Pool }) => ({
      data: {
        pool,
      },
      isLoading: false,
    }));

    mockUseTokenApproval.mockReturnValue(makeUseTokenApprovalOutput());
  });

  it('renders the wallet balance and spending limit for the underlying token', () => {
    const readableWalletBalance = formatTokensToReadableValue({
      value: walletBalanceTokens,
      token: underlyingToken,
    });
    const readableSpendingLimit = formatTokensToReadableValue({
      value: walletSpendingLimitTokens,
      token: underlyingToken,
    });

    renderTransactionForm();

    expect(screen.getByText(en.trade.operationForm.walletBalance)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: readableWalletBalance })).toBeInTheDocument();
    expect(screen.getByText(en.spendingLimit.label)).toBeInTheDocument();
    expect(screen.getByText(readableSpendingLimit)).toBeInTheDocument();
    expect(mockUseGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
        token: underlyingToken,
      },
      {
        enabled: true,
      },
    );
    expect(mockUseTokenApproval).toHaveBeenCalledWith({
      token: underlyingToken,
      spenderAddress: liquidityHub.vhToken.address,
      accountAddress: fakeAccountAddress,
    });
  });

  it('fills the input with the queried wallet balance when clicking it', async () => {
    const readableWalletBalance = formatTokensToReadableValue({
      value: walletBalanceTokens,
      token: underlyingToken,
    });

    renderTransactionForm();

    fireEvent.click(screen.getByRole('button', { name: readableWalletBalance }));

    await waitFor(() => expect(getAmountInput().value).toBe(walletBalanceTokens.toFixed()));
  });

  it('fills the input with the Liquidity Hub wallet balance when clicking MAX', async () => {
    renderTransactionForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.rightMaxButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(getAmountInput().value).toBe(
        walletBalanceTokens.dp(liquidityHub.vhToken.decimals).toFixed(),
      ),
    );
  });

  it('submits through the embedded form, resets the amount, and calls onSubmitSuccess', async () => {
    const onSubmitSuccess = vi.fn();

    renderTransactionForm({ onSubmitSuccess });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '10',
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

  it('shows a validation error when the amount exceeds the wallet balance', async () => {
    const liquidityHubWithLowWalletBalance = {
      ...liquidityHub,
      userWalletBalanceTokens: new BigNumber(1),
    };

    renderTransactionForm({
      liquidityHub: liquidityHubWithLowWalletBalance,
    });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '2',
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          en.marketForm.error.higherThanWalletBalance.replace(
            '{{tokenSymbol}}',
            underlyingToken.symbol,
          ),
        ),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplySubmitButtonLabel,
      }),
    ).toBeDisabled();
  });

  it('shows a validation error when the amount exceeds the wallet spending limit', async () => {
    mockUseTokenApproval.mockReturnValue(
      makeUseTokenApprovalOutput({
        walletSpendingLimitTokens: new BigNumber(1),
      }),
    );

    renderTransactionForm();

    fireEvent.change(getAmountInput(), {
      target: {
        value: '2',
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

  it('creates a Liquidity Hub supply balance mutation from the entered amount', async () => {
    renderTransactionForm();

    fireEvent.change(getAmountInput(), {
      target: {
        value: '10',
      },
    });

    await waitFor(() => {
      const lastCallInput = mockUseSimulatePoolMutations.mock.calls.at(-1)?.[0] as
        | { balanceMutations: BalanceMutation[] }
        | undefined;
      const liquidityHubMutation = lastCallInput?.balanceMutations.find(
        (balanceMutation): balanceMutation is LiquidityHubBalanceMutation =>
          balanceMutation.type === 'liquidityHub',
      );

      expect(lastCallInput?.balanceMutations).toHaveLength(1);
      expect(liquidityHubMutation).toMatchObject({
        action: 'supply',
        vhTokenAddress: liquidityHub.vhToken.address,
      });
      expect(liquidityHubMutation?.amountTokens.isEqualTo(10)).toBe(true);
    });
  });
});
