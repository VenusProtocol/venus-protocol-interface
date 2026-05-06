import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { bnb, busd, xvs } from '__mocks__/models/tokens';
import { vBnb, vXvs } from '__mocks__/models/vTokens';
import { vaults } from '__mocks__/models/vaults';
import {
  type GetPendleSwapQuoteOutput,
  useGetBalanceOf,
  useGetPendleSwapQuote,
  useWithdraw,
  useWithdrawFromPendleVault,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { PendleVault } from 'types';
import { VaultType } from 'types';

import type { Address } from 'viem';
import { WithdrawForm } from '..';

vi.mock('hooks/useGetUserSlippageTolerance');
vi.mock('hooks/useNow');

const fakeSwapQuote: GetPendleSwapQuoteOutput = {
  estimatedReceivedTokensMantissa: new BigNumber('11000000000000000000'),
  feeCents: new BigNumber(25),
  priceImpactPercentage: 0.5,
  pendleMarketAddress: '0xfakePendleMarketAddress' as Address,
  contractCallParamsName: [],
  contractCallParams: [] as unknown as GetPendleSwapQuoteOutput['contractCallParams'],
  requiredApprovals: [],
};

type GetPendleSwapQuoteCall = [
  Parameters<typeof useGetPendleSwapQuote>[0],
  Parameters<typeof useGetPendleSwapQuote>[1],
];

const vault: PendleVault = {
  ...vaults[1],
  key: 'pendle-test-vault',
  vaultType: VaultType.Pendle,
  rewardToken: xvs,
  stakedToken: busd,
  rewardTokenPriceCents: new BigNumber(123),
  stakedTokenPriceCents: new BigNumber(456),
  userStakeBalanceMantissa: new BigNumber('12000000000000000000'),
  vaultAddress: '0x3333333333333333333333333333333333333333',
  maturityDate: new Date('2026-06-25T00:00:00.000Z'),
  liquidityCents: new BigNumber(1000000),
  asset: {
    ...assetData[0],
    vToken: vXvs,
  },
  poolComptrollerContractAddress: '0xfakePoolComptrollerContractAddress' as Address,
  poolName: 'Core Pool',
  managerLink: undefined,
  vaultDeploymentDate: new Date('2026-01-01T00:00:00.000Z'),
};

const maturedVault: PendleVault = {
  ...vault,
  rewardToken: bnb,
  maturityDate: new Date('2026-04-20T00:00:00.000Z'),
  asset: {
    ...vault.asset,
    vToken: vBnb,
  },
};

describe('WithdrawForm', () => {
  const mockUseGetBalanceOf = useGetBalanceOf as Mock;
  const mockUseGetPendleSwapQuote = useGetPendleSwapQuote as Mock;
  const mockUseGetUserSlippageTolerance = useGetUserSlippageTolerance as Mock;
  const mockUseNow = useNow as Mock;
  const mockUseWithdraw = useWithdraw as Mock;
  const mockUseWithdrawFromPendleVault = useWithdrawFromPendleVault as Mock;

  beforeEach(() => {
    mockUseNow.mockReturnValue(new Date('2026-04-29T00:00:00.000Z'));
    mockUseGetUserSlippageTolerance.mockReturnValue({
      userSlippageTolerancePercentage: 5,
    });
    mockUseGetBalanceOf.mockReturnValue({
      data: {
        balanceMantissa: new BigNumber('80000000000000000000'),
      },
      isLoading: false,
    });
    mockUseGetPendleSwapQuote.mockReturnValue({
      data: fakeSwapQuote,
      error: undefined,
      isLoading: false,
    });
    mockUseWithdrawFromPendleVault.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
    mockUseWithdraw.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });
  });

  it('renders the disconnected state and disables quote fetching', async () => {
    renderComponent(<WithdrawForm vault={vault} onClose={vi.fn()} />);

    await waitFor(() =>
      expect(screen.getByText(en.vault.modals.connectWalletMessage)).toBeInTheDocument(),
    );
    expect(screen.queryByPlaceholderText('0.00')).not.toBeInTheDocument();
    expect(screen.queryByText(en.vault.modals.maturityPendleDisclaimer)).not.toBeInTheDocument();

    expect(mockUseGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
        token: vault.rewardToken,
      },
      {
        enabled: false,
      },
    );

    const lastQuoteCall = mockUseGetPendleSwapQuote.mock.calls.at(-1);

    expect(lastQuoteCall).toBeDefined();

    if (!lastQuoteCall) {
      throw new Error('Expected useGetPendleSwapQuote to be called');
    }

    const [quoteInput, quoteOptions] = lastQuoteCall as GetPendleSwapQuoteCall;

    expect(quoteInput.amountTokens.isNaN()).toBe(true);
    expect(quoteInput.slippagePercentage).toBe(5);
    expect(quoteOptions).toEqual({
      enabled: false,
    });
  });

  it('withdraws through Pendle before maturity using the swap quote', async () => {
    const onClose = vi.fn();
    const withdraw = vi.fn().mockResolvedValue(undefined);

    mockUseWithdrawFromPendleVault.mockReturnValue({
      mutateAsync: withdraw,
    });

    renderComponent(<WithdrawForm vault={vault} onClose={onClose} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getByText(en.vault.modals.maturityPendleDisclaimer)).toBeInTheDocument();

    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;

    fireEvent.click(screen.getByRole('button', { name: '12 XVS' }));

    await waitFor(() => expect(input.value).toBe('12'));
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: en.vault.modals.withdraw,
        }),
      ).toBeEnabled(),
    );

    expect(
      mockUseGetPendleSwapQuote.mock.calls.some(
        ([quoteInput, quoteOptions]) =>
          quoteInput.fromToken === vault.rewardToken &&
          quoteInput.toToken === vault.stakedToken &&
          quoteInput.amountTokens.toFixed() === '12' &&
          quoteInput.slippagePercentage === 5 &&
          quoteOptions.enabled === true,
      ),
    ).toBe(true);

    fireEvent.click(
      screen.getByRole('button', {
        name: en.vault.modals.withdraw,
      }),
    );

    await waitFor(() => expect(withdraw).toHaveBeenCalledTimes(1));
    expect(withdraw).toHaveBeenCalledWith({
      swapQuote: fakeSwapQuote,
      type: 'withdraw',
      fromToken: vault.rewardToken,
      toToken: vault.stakedToken,
      amountMantissa: new BigNumber('1200000000'),
      vToken: vault.asset.vToken,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

    expect(mockUseWithdrawFromPendleVault).toHaveBeenCalledWith({
      pendleMarketAddress: fakeSwapQuote.pendleMarketAddress,
    });
  });

  it('redeems at maturity and links to Pendle for the final redemption step', async () => {
    const onClose = vi.fn();
    const withdrawAfterMaturity = vi.fn().mockResolvedValue(undefined);

    mockUseWithdraw.mockReturnValue({
      mutateAsync: withdrawAfterMaturity,
    });

    renderComponent(<WithdrawForm vault={maturedVault} onClose={onClose} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.queryByText(en.vault.modals.maturityPendleDisclaimer)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pendle official' })).toHaveAttribute(
      'href',
      'https://app.pendle.finance/trade/dashboard/overview/positions?timeframe=allTime',
    );

    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;

    fireEvent.click(screen.getByRole('button', { name: '12 BNB' }));

    await waitFor(() => expect(input.value).toBe('12'));
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: en.vault.modals.withdraw,
        }),
      ).toBeEnabled(),
    );

    expect(
      mockUseGetPendleSwapQuote.mock.calls.some(
        ([quoteInput, quoteOptions]) =>
          quoteInput.amountTokens.toFixed() === '12' && quoteOptions.enabled === false,
      ),
    ).toBe(true);

    fireEvent.click(
      screen.getByRole('button', {
        name: en.vault.modals.withdraw,
      }),
    );

    await waitFor(() => expect(withdrawAfterMaturity).toHaveBeenCalledTimes(1));
    expect(withdrawAfterMaturity).toHaveBeenCalledWith({
      poolName: maturedVault.poolName,
      poolComptrollerContractAddress: maturedVault.poolComptrollerContractAddress,
      vToken: maturedVault.asset.vToken,
      withdrawFullSupply: true,
      unwrap: true,
      amountMantissa: new BigNumber('1200000000'),
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
