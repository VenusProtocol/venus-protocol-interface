import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import {
  useGetBalanceOf,
  useGetLiquidityHubs,
  useGetPool,
  useGetPoolDelegateApprovalStatus,
  useWithdrawFromLiquidityHub,
  useWithdrawPositionFromLiquidityHub,
} from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAnalytics } from 'libs/analytics';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type {
  Asset,
  AssetBalanceMutation,
  BalanceMutation,
  LiquidityHubBalanceMutation,
  Pool,
} from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { WithdrawForm, type WithdrawFormProps } from '..';

const baseLiquidityHub = liquidityHubs[0];
const defaultWithdrawLimitTokens = baseLiquidityHub.userSupplyBalanceTokens ?? new BigNumber(0);
const liquidityHub = {
  ...baseLiquidityHub,
  pricePerShare: new BigNumber(1),
  redeemFeePercentage: new BigNumber(0),
  userVhTokenBalanceTokens: defaultWithdrawLimitTokens,
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

  it('takes the Hub redeem fee out of the max redeem limit', () => {
    renderTransactionForm({
      liquidityHub: {
        ...liquidityHub,
        pricePerShare: new BigNumber(2),
        redeemFeePercentage: new BigNumber(0.5),
        userVhTokenBalanceTokens: new BigNumber(100),
        userWithdrawCapTokens: new BigNumber(1000),
        userVhTokenMaxRedeemTokens: new BigNumber(100),
      },
    });

    // 100 shares x 2 x (1 - 0.5%)
    expect(
      screen.getByRole('button', {
        name: formatTokensToReadableValue({ value: new BigNumber(199), token: underlyingToken }),
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
      userVhTokenBalanceMantissa: new BigNumber('42000000000000000000'),
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

  it('submits the withdrawal limit and redeems the full supply when max redeem is reached', async () => {
    const withdrawFromLiquidityHub = vi.fn().mockResolvedValue(undefined);
    const withdrawalLimitTokens = defaultWithdrawLimitTokens;

    mockUseWithdrawFromLiquidityHub.mockReturnValue({
      mutateAsync: withdrawFromLiquidityHub,
      isPending: false,
    });

    renderTransactionForm();

    fireEvent.change(getAmountInput(), {
      target: {
        value: withdrawalLimitTokens.toFixed(),
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
        userVhTokenBalanceMantissa: new BigNumber('42000000000000000000'),
      }),
    );
  });

  it('does not redeem the whole wallet when the live balance grew past the indexed max redeem', async () => {
    const withdrawFromLiquidityHub = vi.fn().mockResolvedValue(undefined);

    mockUseWithdrawFromLiquidityHub.mockReturnValue({
      mutateAsync: withdrawFromLiquidityHub,
      isPending: false,
    });
    (useGetBalanceOf as Mock).mockReturnValue({
      data: { balanceMantissa: new BigNumber('60000000000000000000') },
    });

    renderTransactionForm();

    // The indexed max redeem is still 42, the wallet now holds 60 shares
    fireEvent.change(getAmountInput(), { target: { value: '42' } });
    fireEvent.click(
      screen.getByRole('button', { name: en.liquidityHubForm.withdrawSubmitButtonLabel }),
    );

    await waitFor(() =>
      expect(withdrawFromLiquidityHub).toHaveBeenCalledWith(
        expect.objectContaining({ withdrawFullSupply: false }),
      ),
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

  describe('when the position is partly resupplied to Core', () => {
    const corePoolVhAsset: Asset = {
      ...assetData[0],
      vToken: {
        ...assetData[0].vToken,
        underlyingToken: {
          ...liquidityHub.vhToken,
          iconSrc: assetData[0].vToken.underlyingToken.iconSrc,
        },
      },
      userSupplyBalanceTokens: new BigNumber(10),
      isCollateralOfUser: true,
    };

    const resuppliedLiquidityHub = {
      ...liquidityHub,
      pricePerShare: new BigNumber(2),
      userVhTokenBalanceTokens: new BigNumber(5),
      userSupplyBalanceTokens: new BigNumber(30),
      liquidityTokens: new BigNumber(1000),
      withdrawCapTokens: new BigNumber(1000),
    };

    const withdrawFromLiquidityHub = vi.fn().mockResolvedValue(undefined);
    const withdrawPositionFromLiquidityHub = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
      withdrawFromLiquidityHub.mockClear();
      withdrawPositionFromLiquidityHub.mockClear();

      (useIsFeatureEnabled as Mock).mockImplementation(
        ({ name }: { name: string }) => name === 'liquidityHubAutoResupply',
      );
      mockUseGetPool.mockReturnValue({
        data: {
          pool: {
            ...poolData[0],
            assets: [corePoolVhAsset],
            userBorrowBalanceCents: new BigNumber(0),
          },
        },
        isLoading: false,
      });
      mockUseWithdrawFromLiquidityHub.mockReturnValue({
        mutateAsync: withdrawFromLiquidityHub,
        isPending: false,
      });
      (useWithdrawPositionFromLiquidityHub as Mock).mockReturnValue({
        mutateAsync: withdrawPositionFromLiquidityHub,
        isPending: false,
      });
      (useGetPoolDelegateApprovalStatus as Mock).mockReturnValue({
        data: { isDelegateeApproved: true },
        isLoading: false,
      });
    });

    const submitAmount = (value: string) => {
      fireEvent.change(getAmountInput(), {
        target: {
          value,
        },
      });
      fireEvent.click(
        screen.getByRole('button', {
          name: en.liquidityHubForm.withdrawSubmitButtonLabel,
        }),
      );
    };

    it('makes both the wallet and the Core parts of the position available', () => {
      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      expect(
        screen.getByText(
          formatTokensToReadableValue({
            value: new BigNumber(30),
            token: underlyingToken,
          }),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: en.liquidityHubForm.rightSafeMaxButtonLabel }),
      ).toBeInTheDocument();
    });

    it('redeems from the Hub directly when wallet vhTokens cover the amount', async () => {
      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      submitAmount('8');

      await waitFor(() => expect(withdrawFromLiquidityHub).toHaveBeenCalledTimes(1));
      expect(withdrawPositionFromLiquidityHub).not.toHaveBeenCalled();
    });

    it('withdraws through the collateral gateway when Core vhTokens are needed', async () => {
      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      submitAmount('16');

      await waitFor(() =>
        expect(withdrawPositionFromLiquidityHub).toHaveBeenCalledWith({
          liquidityHub: resuppliedLiquidityHub,
          vhMarketVToken: corePoolVhAsset.vToken,
          amountMantissa: new BigNumber('16000000000000000000'),
          sharesMantissa: new BigNumber('8000000000000000000'),
          withdrawFullPosition: false,
        }),
      );
      expect(withdrawFromLiquidityHub).not.toHaveBeenCalled();
      expect(useTokenApproval).toHaveBeenCalledWith(
        expect.objectContaining({
          spenderAddress: '0xfakeCollateralGatewayContractAddress',
          token: expect.objectContaining({ address: liquidityHub.vhToken.address }),
        }),
      );
    });

    it('shows the unchanged health factor when wallet vhTokens cover a withdrawal with a loan', async () => {
      mockUseGetPool.mockReturnValue({
        data: {
          pool: {
            ...poolData[0],
            assets: [corePoolVhAsset],
            userBorrowBalanceCents: new BigNumber(1000),
            userHealthFactor: 2,
          },
        },
        isLoading: false,
      });

      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      fireEvent.change(getAmountInput(), {
        target: {
          value: '8',
        },
      });

      await waitFor(() =>
        expect(screen.getByText(en.accountHealth.healthFactor.label)).toBeInTheDocument(),
      );
    });

    it('does not show the health factor when the Core position is not collateral', async () => {
      mockUseGetPool.mockReturnValue({
        data: {
          pool: {
            ...poolData[0],
            assets: [{ ...corePoolVhAsset, isCollateralOfUser: false }],
            userBorrowBalanceCents: new BigNumber(1000),
            userHealthFactor: 2,
          },
        },
        isLoading: false,
      });

      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      fireEvent.change(getAmountInput(), {
        target: {
          value: '8',
        },
      });

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: en.liquidityHubForm.withdrawSubmitButtonLabel }),
        ).toBeEnabled(),
      );
      expect(screen.queryByText(en.accountHealth.healthFactor.label)).not.toBeInTheDocument();
    });

    it('blocks a withdrawal that would pull more wallet vhTokens than the gateway allowance', async () => {
      (useTokenApproval as Mock).mockReturnValue({
        isTokenApproved: true,
        isWalletSpendingLimitLoading: false,
        isApproveTokenLoading: false,
        isRevokeWalletSpendingLimitLoading: false,
        walletSpendingLimitTokens: new BigNumber(1),
        approveToken: vi.fn(),
        revokeWalletSpendingLimit: vi.fn(),
      });

      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      submitAmount('16');

      await waitFor(() =>
        expect(
          screen.getByText(en.liquidityHubForm.error.higherThanWalletSpendingLimit),
        ).toBeInTheDocument(),
      );
      expect(withdrawPositionFromLiquidityHub).not.toHaveBeenCalled();
    });

    it('keeps the submit button loading until the delegate approval status is known', async () => {
      (useGetPoolDelegateApprovalStatus as Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      const { container } = renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      fireEvent.change(getAmountInput(), {
        target: {
          value: '16',
        },
      });

      await waitFor(() => expect(container.querySelector('button[type="submit"]')).toBeDisabled());
    });

    it('only offers the wallet part when Core withdrawals are paused', async () => {
      mockUseGetPool.mockReturnValue({
        data: {
          pool: {
            ...poolData[0],
            assets: [{ ...corePoolVhAsset, disabledTokenActions: ['withdraw'] }],
            userBorrowBalanceCents: new BigNumber(0),
          },
        },
        isLoading: false,
      });

      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      expect(
        screen.queryByRole('button', { name: en.liquidityHubForm.rightSafeMaxButtonLabel }),
      ).not.toBeInTheDocument();

      submitAmount('8');

      await waitFor(() => expect(withdrawFromLiquidityHub).toHaveBeenCalledTimes(1));
      expect(withdrawPositionFromLiquidityHub).not.toHaveBeenCalled();
    });

    it('asks the gateway for enough shares to pay out the amount after the redeem fee', async () => {
      renderTransactionForm({
        liquidityHub: { ...resuppliedLiquidityHub, redeemFeePercentage: new BigNumber(0.5) },
      });

      submitAmount('15.92');

      // 15.92 / (2 x 0.995) = 8 shares
      await waitFor(() =>
        expect(withdrawPositionFromLiquidityHub).toHaveBeenCalledWith(
          expect.objectContaining({
            sharesMantissa: new BigNumber('8000000000000000000'),
          }),
        ),
      );
    });

    it('routes the withdrawal from the on-chain wallet balance rather than the indexed one', async () => {
      (useGetBalanceOf as Mock).mockReturnValue({
        data: { balanceMantissa: new BigNumber('2000000000000000000') },
      });

      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      // The API reports 5 wallet vhTokens (10 underlying), the chain only 2 (4 underlying)
      submitAmount('8');

      await waitFor(() => expect(withdrawPositionFromLiquidityHub).toHaveBeenCalledTimes(1));
      expect(withdrawFromLiquidityHub).not.toHaveBeenCalled();
    });

    it('shows the Supply balance from on-chain shares rather than the indexed total', async () => {
      (useGetLiquidityHubs as Mock).mockReturnValue({
        isLoading: false,
        data: { liquidityHubs: [resuppliedLiquidityHub] },
      });
      (useGetBalanceOf as Mock).mockReturnValue({
        data: { balanceMantissa: new BigNumber('2000000000000000000') },
      });

      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      fireEvent.change(getAmountInput(), {
        target: {
          value: '4',
        },
      });

      // (2 wallet + 10 Core vhTokens) x 2 = 24, while the API reports 30
      const hasText = (text: string) => (_: string, element: Element | null) =>
        element?.textContent?.trim() === text;

      // Before and after values render side by side
      await waitFor(() => expect(screen.getAllByText(hasText('2420')).length).toBeGreaterThan(0));
      expect(screen.queryAllByText(hasText('3026'))).toHaveLength(0);
    });

    it('bases the current daily earnings on the on-chain balance rather than the indexed one', async () => {
      const staleLiquidityHub = {
        ...resuppliedLiquidityHub,
        userYearlyEarningsCents: new BigNumber(365_000),
      };
      (useGetLiquidityHubs as Mock).mockReturnValue({
        isLoading: false,
        data: { liquidityHubs: [staleLiquidityHub] },
      });
      (useGetBalanceOf as Mock).mockReturnValue({
        data: { balanceMantissa: new BigNumber('2000000000000000000') },
      });

      renderTransactionForm({ liquidityHub: staleLiquidityHub });

      fireEvent.change(getAmountInput(), {
        target: {
          value: '4',
        },
      });

      // The API's yearly earnings come to $10 a day, the 24 on-chain tokens to $0.03
      await waitFor(() =>
        expect(document.querySelector('form')).toHaveTextContent(
          `${en.accountLiquidityHubDailyEarnings.label}$0.03$0.02`,
        ),
      );
    });

    it('weights the current Prime APY by the on-chain wallet shares rather than the indexed ones', async () => {
      const primeToken = assetData[0].vToken.underlyingToken;
      const primeVhAsset: Asset = {
        ...corePoolVhAsset,
        userSupplyBalanceTokens: new BigNumber(100),
        supplyTokenDistributions: [
          { type: 'prime', token: primeToken, apyPercentage: new BigNumber(8), isActive: true },
        ],
      };
      // The API still counts 200 wallet shares, so Prime is weighted by 100 / 300
      const staleLiquidityHub = {
        ...liquidityHub,
        pricePerShare: new BigNumber(1),
        tokenPriceCents: new BigNumber(100),
        supplyApyPercentage: new BigNumber(0),
        liquidityTokens: new BigNumber(1000),
        withdrawCapTokens: new BigNumber(1000),
        userVhTokenBalanceTokens: new BigNumber(200),
        supplyTokenDistributions: [
          {
            type: 'prime' as const,
            token: primeToken,
            apyPercentage: new BigNumber(8).dividedBy(3),
            isActive: true,
          },
        ],
      };

      mockUseGetPool.mockReturnValue({
        data: {
          pool: {
            ...poolData[0],
            assets: [primeVhAsset],
            userBorrowBalanceCents: new BigNumber(0),
          },
        },
        isLoading: false,
      });
      (useGetLiquidityHubs as Mock).mockReturnValue({
        isLoading: false,
        data: { liquidityHubs: [staleLiquidityHub] },
      });
      (useGetBalanceOf as Mock).mockReturnValue({
        data: { balanceMantissa: new BigNumber('100000000000000000000') },
      });

      renderTransactionForm({ liquidityHub: staleLiquidityHub });

      fireEvent.change(getAmountInput(), {
        target: {
          value: '1',
        },
      });

      // 200 tokens at 8% x 100 / 200 earn $0.02 a day, before and after a 1 token withdrawal
      await waitFor(() =>
        expect(document.querySelector('form')).toHaveTextContent(
          `${en.accountLiquidityHubDailyEarnings.label}$0.02$0.02`,
        ),
      );
    });

    it('previews an empty position after withdrawing all of it with SAFE MAX', async () => {
      const thirdPricedLiquidityHub = {
        ...resuppliedLiquidityHub,
        pricePerShare: new BigNumber(1).dividedBy(3),
      };
      (useGetLiquidityHubs as Mock).mockReturnValue({
        isLoading: false,
        data: { liquidityHubs: [thirdPricedLiquidityHub] },
      });

      renderTransactionForm({ liquidityHub: thirdPricedLiquidityHub });

      fireEvent.click(
        screen.getByRole('button', { name: en.liquidityHubForm.rightSafeMaxButtonLabel }),
      );

      await waitFor(() => expect(getAmountInput().value).not.toBe(''));
      expect(document.querySelector('form')).not.toHaveTextContent('< 0.000001');
    });

    it('lets the user withdraw on-chain shares the indexed total has not caught up with', async () => {
      (useGetBalanceOf as Mock).mockReturnValue({
        data: { balanceMantissa: new BigNumber('2000000000000000000') },
      });

      renderTransactionForm({
        liquidityHub: { ...resuppliedLiquidityHub, userSupplyBalanceTokens: new BigNumber(10) },
      });

      submitAmount('20');

      await waitFor(() => expect(withdrawPositionFromLiquidityHub).toHaveBeenCalledTimes(1));
    });

    it('simulates the Core part of the withdrawal in vhTokens', async () => {
      renderTransactionForm({ liquidityHub: resuppliedLiquidityHub });

      fireEvent.change(getAmountInput(), {
        target: {
          value: '16',
        },
      });

      await waitFor(() => {
        const lastCallInput = mockUseSimulatePoolMutations.mock.calls.at(-1)?.[0] as
          | { balanceMutations: BalanceMutation[] }
          | undefined;
        const coreMutation = lastCallInput?.balanceMutations.find(
          (balanceMutation): balanceMutation is AssetBalanceMutation =>
            balanceMutation.type === 'asset',
        );

        expect(coreMutation).toMatchObject({
          action: 'withdraw',
          vTokenAddress: corePoolVhAsset.vToken.address,
        });
        expect(coreMutation?.amountTokens.toFixed()).toBe('3');
      });
    });
  });
});
