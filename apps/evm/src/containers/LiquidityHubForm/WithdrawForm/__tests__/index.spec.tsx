import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetPool, useWithdrawFromLiquidityHub } from 'clients/api';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import { useAnalytics } from 'libs/analytics';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { BalanceMutation, LiquidityHubBalanceMutation, Pool } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { WithdrawForm, type WithdrawFormProps } from '..';

const baseLiquidityHub = liquidityHubs[0];
const defaultWithdrawLimitTokens = baseLiquidityHub.userSupplyBalanceTokens ?? new BigNumber(0);
const liquidityHub = {
  ...baseLiquidityHub,
  pricePerShare: new BigNumber(1),
  userWithdrawCapTokens: defaultWithdrawLimitTokens,
  userVhTokenMaxRedeemTokens: defaultWithdrawLimitTokens,
};
const underlyingToken = liquidityHub.vhToken.underlyingToken;
const mockCaptureAnalyticEvent = vi.fn();

const renderTransactionForm = (
  props: Partial<WithdrawFormProps> = {},
  options?: Parameters<typeof renderComponent>[1],
) =>
  renderComponent(<WithdrawForm liquidityHub={liquidityHub} {...props} />, {
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

describe('WithdrawForm', () => {
  const mockUseGetPool = useGetPool as Mock;
  const mockUseWithdrawFromLiquidityHub = useWithdrawFromLiquidityHub as Mock;
  const mockUseSimulatePoolMutations = useSimulatePoolMutations as Mock;

  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });

    mockUseWithdrawFromLiquidityHub.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
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
  });

  it('renders the user withdraw cap as the withdrawal limit when it is lower than max redeem', () => {
    const withdrawalLimitTokens = new BigNumber(5);
    const readableWithdrawalLimit = formatTokensToReadableValue({
      value: withdrawalLimitTokens,
      token: underlyingToken,
    });

    renderTransactionForm({
      liquidityHub: {
        ...liquidityHub,
        userWithdrawCapTokens: withdrawalLimitTokens,
        userVhTokenMaxRedeemTokens: new BigNumber(100),
      },
    });

    expect(screen.getByText(en.availableBalance.label)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: readableWithdrawalLimit,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(en.spendingLimit.label)).not.toBeInTheDocument();
  });

  it('renders the max redeem amount as the withdrawal limit when it is lower than the user withdraw cap', () => {
    const withdrawalLimitTokens = new BigNumber(6);
    const liquidityHubWithLowerMaxRedeem = {
      ...liquidityHub,
      pricePerShare: new BigNumber(2),
      userWithdrawCapTokens: new BigNumber(10),
      userVhTokenMaxRedeemTokens: new BigNumber(3),
    };
    const readableWithdrawalLimit = formatTokensToReadableValue({
      value: withdrawalLimitTokens,
      token: underlyingToken,
    });

    renderTransactionForm({ liquidityHub: liquidityHubWithLowerMaxRedeem });

    expect(
      screen.getByRole('button', {
        name: readableWithdrawalLimit,
      }),
    ).toBeInTheDocument();
  });

  it('fills the input with the withdrawal limit when clicking the available balance', async () => {
    const withdrawalLimitTokens = defaultWithdrawLimitTokens;
    const readableWithdrawalLimit = formatTokensToReadableValue({
      value: withdrawalLimitTokens,
      token: underlyingToken,
    });

    renderTransactionForm();

    fireEvent.click(screen.getByRole('button', { name: readableWithdrawalLimit }));

    await waitFor(() => expect(getAmountInput().value).toBe(withdrawalLimitTokens.toFixed()));
  });

  it('fills the input with the withdrawal limit when clicking MAX', async () => {
    const withdrawalLimitTokens = defaultWithdrawLimitTokens;

    renderTransactionForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.rightMaxButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(getAmountInput().value).toBe(
        withdrawalLimitTokens.dp(liquidityHub.vhToken.underlyingToken.decimals).toFixed(),
      ),
    );
  });

  it('submits through the embedded form, resets the amount, and calls onSubmitSuccess', async () => {
    const withdrawFromLiquidityHub = vi.fn().mockResolvedValue(undefined);
    const onSubmitSuccess = vi.fn();

    mockUseWithdrawFromLiquidityHub.mockReturnValue({
      mutateAsync: withdrawFromLiquidityHub,
      isPending: false,
    });

    renderTransactionForm({ onSubmitSuccess });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '10',
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawSubmitButtonLabel,
      }),
    );

    await waitFor(() => expect(getAmountInput().value).toBe(''));
    expect(withdrawFromLiquidityHub).toHaveBeenCalledWith({
      liquidityHub,
      amountMantissa: new BigNumber('10000000000000000000'),
      withdrawFullSupply: false,
      userVhTokenBalanceMantissa: new BigNumber('39622641509433962264'),
    });
    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith(
      'withdraw_amount_set',
      expect.objectContaining({
        poolName: 'liquidity_hub',
        assetSymbol: underlyingToken.symbol,
        maxSelected: false,
      }),
      {
        debounced: true,
      },
    );
    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith(
      'withdraw_initiated',
      expect.objectContaining({
        poolName: 'liquidity_hub',
        assetSymbol: underlyingToken.symbol,
      }),
    );
    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith(
      'withdraw_signed',
      expect.objectContaining({
        poolName: 'liquidity_hub',
        assetSymbol: underlyingToken.symbol,
      }),
    );
    expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
  });

  it('tracks rejected withdraw transactions', async () => {
    mockUseWithdrawFromLiquidityHub.mockReturnValue({
      mutateAsync: vi.fn().mockRejectedValue(new Error('User rejected transaction')),
      isPending: false,
    });

    renderTransactionForm();

    fireEvent.change(getAmountInput(), {
      target: {
        value: '10',
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawSubmitButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith(
        'withdraw_rejected',
        expect.objectContaining({
          poolName: 'liquidity_hub',
          assetSymbol: underlyingToken.symbol,
        }),
      ),
    );
  });

  it('submits a full withdrawal as a redeem', async () => {
    const withdrawFromLiquidityHub = vi.fn().mockResolvedValue(undefined);

    mockUseWithdrawFromLiquidityHub.mockReturnValue({
      mutateAsync: withdrawFromLiquidityHub,
      isPending: false,
    });

    renderTransactionForm();

    fireEvent.change(getAmountInput(), {
      target: {
        value: defaultWithdrawLimitTokens.toFixed(),
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawSubmitButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(withdrawFromLiquidityHub).toHaveBeenCalledWith({
        liquidityHub,
        amountMantissa: new BigNumber('42000000000000000000'),
        withdrawFullSupply: true,
        userVhTokenBalanceMantissa: new BigNumber('39622641509433962264'),
      }),
    );
  });

  it('shows a validation error when the amount exceeds hub liquidity', async () => {
    renderTransactionForm({
      liquidityHub: {
        ...liquidityHub,
        liquidityTokens: new BigNumber(1),
        userSupplyBalanceTokens: new BigNumber(100),
      },
    });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '2',
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText(en.liquidityHubForm.error.higherThanAvailableLiquidity),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawSubmitButtonLabel,
      }),
    ).toBeDisabled();
  });

  it('shows a validation error when the amount exceeds the user supply balance', async () => {
    renderTransactionForm({
      liquidityHub: {
        ...liquidityHub,
        liquidityTokens: new BigNumber(100),
        userSupplyBalanceTokens: new BigNumber(1),
      },
    });

    fireEvent.change(getAmountInput(), {
      target: {
        value: '2',
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText(en.liquidityHubForm.error.higherThanAvailableAmount),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawSubmitButtonLabel,
      }),
    ).toBeDisabled();
  });

  it('creates a Liquidity Hub withdraw balance mutation from the entered amount', async () => {
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
        action: 'withdraw',
        vhTokenAddress: liquidityHub.vhToken.address,
      });
      expect(liquidityHubMutation?.amountTokens.isEqualTo(10)).toBe(true);
    });
  });
});
