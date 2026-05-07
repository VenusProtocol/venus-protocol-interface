import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { poolData } from '__mocks__/models/pools';
import { bnb } from '__mocks__/models/tokens';
import { fixedRatedVaults, vaults } from '__mocks__/models/vaults';
import { useGetBalanceOf, useGetPendleSwapQuote, useStakeInPendleVault } from 'clients/api';
import type { GetPendleSwapQuoteOutput } from 'clients/api';
import type { PendleVaultProtocolData } from 'clients/api/queries/getFixedRatedVaults/types';
import { NULL_ADDRESS } from 'constants/address';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { PendleVault, Token, VToken } from 'types';
import { ChainId, VaultCategory, VaultManager, VaultStatus, VaultType } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import type { Address } from 'viem';

import { DepositForm } from '..';

vi.mock('hooks/useGetUserSlippageTolerance');

const fakePendlePtVaultAddress = '0xfakePendlePtVaultContractAddress' as Address;
const fakePendleMarketAddress = '0xfakePendleMarketAddress' as Address;
const fakeWalletBalanceMantissa = new BigNumber('12000000000000000000');
const fixedRatedVault = fixedRatedVaults[0];
const protocolData = fixedRatedVault.protocolData as PendleVaultProtocolData;

const ptClisBnbToken: Token = {
  chainId: ChainId.BSC_TESTNET,
  address: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
  decimals: 18,
  symbol: 'PT-clisBNB-25JUN2026',
  iconSrc: '',
};

const vPtClisBnb: VToken = {
  chainId: ChainId.BSC_TESTNET,
  address: '0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
  decimals: 8,
  symbol: 'vPT-clisBNB-25JUN2026',
  underlyingToken: ptClisBnbToken,
};

const asset = {
  ...assetData[0],
  vToken: vPtClisBnb,
  supplyCapTokens: new BigNumber(5),
  supplyBalanceTokens: new BigNumber(2),
};

const vault: PendleVault = {
  ...vaults[1],
  key: `${ChainId.BSC_TESTNET}-pendle-${fixedRatedVault.vaultAddress}`,
  category: VaultCategory.YIELD_TOKENS,
  vaultType: VaultType.Pendle,
  manager: VaultManager.Pendle,
  managerIcon: 'pendle',
  managerAddress: protocolData.pendleMarketAddress as Address,
  managerLink: `https://app.pendle.finance/trade/pools/${protocolData.pendleMarketAddress}/zap/in?chain=bnbchain`,
  status: VaultStatus.Deposit,
  vaultAddress: fixedRatedVault.vaultAddress,
  stakedToken: bnb,
  rewardToken: ptClisBnbToken,
  maturityDate: new Date(fixedRatedVault.maturityDate),
  vaultDeploymentDate: new Date(protocolData.startDate),
  liquidityCents: new BigNumber(protocolData.liquidityCents),
  asset,
  poolComptrollerContractAddress: poolData[0].comptrollerAddress as Address,
  poolName: poolData[0].name,
};

const fakeSwapQuote: GetPendleSwapQuoteOutput = {
  estimatedReceivedTokensMantissa: new BigNumber('3100000000000000000'),
  feeCents: new BigNumber(25),
  priceImpactPercentage: 0.1,
  pendleMarketAddress: fakePendleMarketAddress,
  contractCallParamsName: [],
  contractCallParams: [] as unknown as GetPendleSwapQuoteOutput['contractCallParams'],
  requiredApprovals: [],
};

describe('DepositForm', () => {
  beforeEach(() => {
    (useGetBalanceOf as Mock).mockReturnValue({
      data: {
        balanceMantissa: fakeWalletBalanceMantissa,
      },
      isLoading: false,
    });

    (useGetContractAddress as Mock).mockReturnValue({
      address: fakePendlePtVaultAddress,
    });

    (useGetUserSlippageTolerance as Mock).mockReturnValue({
      userSlippageTolerancePercentage: 0.5,
    });

    (useGetPendleSwapQuote as Mock).mockImplementation(
      (_input: unknown, options?: { enabled?: boolean }) => ({
        data: options?.enabled ? fakeSwapQuote : undefined,
        error: null,
        isLoading: false,
      }),
    );

    (useStakeInPendleVault as Mock).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    });

    (useTokenApproval as Mock).mockReturnValue({
      isTokenApproved: true,
      isWalletSpendingLimitLoading: false,
      isApproveTokenLoading: false,
      isRevokeWalletSpendingLimitLoading: false,
      walletSpendingLimitTokens: new BigNumber(100),
      approveToken: vi.fn(),
      revokeWalletSpendingLimit: vi.fn().mockResolvedValue(undefined),
    });
  });

  it('displays the disconnected state and skips the amount field', async () => {
    renderComponent(<DepositForm vault={vault} onClose={vi.fn()} />);

    await waitFor(() =>
      expect(screen.getByText(en.vault.modals.connectWalletMessage)).toBeInTheDocument(),
    );
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();

    expect(useGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
        token: bnb,
      },
      {
        enabled: false,
      },
    );
  });

  it('caps the available amount by the remaining supply cap and requests a quote for that amount', async () => {
    const expectedLimit = new BigNumber(3);

    renderComponent(<DepositForm vault={vault} onClose={vi.fn()} />, {
      accountAddress: fakeAccountAddress,
    });

    const readableLimit = formatTokensToReadableValue({
      value: expectedLimit,
      token: vault.stakedToken,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: readableLimit,
      }),
    );

    await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(3));
    await waitFor(() =>
      expect(useTokenApproval).toHaveBeenCalledWith(
        expect.objectContaining({
          accountAddress: fakeAccountAddress,
          spenderAddress: fakePendlePtVaultAddress,
          token: vault.stakedToken,
        }),
      ),
    );

    await waitFor(() => {
      const lastCall = (useGetPendleSwapQuote as Mock).mock.lastCall;

      expect(lastCall).toBeDefined();

      const [quoteInput, quoteOptions] = lastCall as [
        {
          fromToken: Token;
          toToken: Token;
          amountTokens: BigNumber;
          slippagePercentage: number;
        },
        { enabled?: boolean },
      ];

      expect(quoteInput.fromToken).toEqual(vault.stakedToken);
      expect(quoteInput.toToken).toEqual(vault.rewardToken);
      expect(quoteInput.amountTokens.toFixed()).toBe('3');
      expect(quoteInput.slippagePercentage).toBe(0.5);
      expect(quoteOptions).toEqual({ enabled: true });
    });
  });

  it('submits the deposit with the swap quote and closes the modal', async () => {
    const onClose = vi.fn();
    const deposit = vi.fn().mockResolvedValue(undefined);
    const expectedAmountTokens = new BigNumber(3);

    (useStakeInPendleVault as Mock).mockReturnValue({
      mutateAsync: deposit,
    });

    renderComponent(<DepositForm vault={vault} onClose={onClose} />, {
      accountAddress: fakeAccountAddress,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: formatTokensToReadableValue({
          value: expectedAmountTokens,
          token: vault.stakedToken,
        }),
      }),
    );

    await waitFor(() =>
      expect(useStakeInPendleVault).toHaveBeenLastCalledWith({
        pendleMarketAddress: fakePendleMarketAddress,
        isNative: true,
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: en.vault.modals.deposit,
        }),
      ).toBeEnabled(),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: en.vault.modals.deposit,
      }),
    );

    await waitFor(() => expect(deposit).toHaveBeenCalledTimes(1));
    expect(deposit).toHaveBeenCalledWith({
      swapQuote: fakeSwapQuote,
      type: 'deposit',
      fromToken: vault.stakedToken,
      toToken: vault.rewardToken,
      amountMantissa: convertTokensToMantissa({
        value: expectedAmountTokens,
        token: vault.stakedToken,
      }),
      vToken: vault.asset.vToken,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
