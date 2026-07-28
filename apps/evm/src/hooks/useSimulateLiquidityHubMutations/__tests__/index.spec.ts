import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderHook } from 'testUtils/render';
import type { BalanceMutation, LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { useSimulateLiquidityHubMutations } from '..';

const [xvsLiquidityHub, usdcLiquidityHub] = liquidityHubs;

const createLiquidityHubBalanceMutation = (
  overrides: Partial<LiquidityHubBalanceMutation> = {},
): LiquidityHubBalanceMutation => ({
  type: 'liquidityHub',
  vhTokenAddress: xvsLiquidityHub.vhToken.address,
  action: 'supply',
  amountTokens: new BigNumber(10),
  ...overrides,
});

const renderUseSimulateLiquidityHubMutations = ({
  customLiquidityHubs = [xvsLiquidityHub, usdcLiquidityHub],
  balanceMutations,
}: {
  customLiquidityHubs?: LiquidityHub[];
  balanceMutations: BalanceMutation[];
}) =>
  renderHook(() =>
    useSimulateLiquidityHubMutations({
      liquidityHubs: customLiquidityHubs,
      balanceMutations,
    }),
  );

describe('useSimulateLiquidityHubMutations', () => {
  it('returns an empty array when all liquidity hub mutations have an amount of zero', () => {
    const { result } = renderUseSimulateLiquidityHubMutations({
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          amountTokens: new BigNumber(0),
        }),
      ],
    });

    expect(result.current.liquidityHubs).toEqual([]);
  });

  it('returns unchanged liquidity hubs when there is no matching liquidity hub mutation', () => {
    const assetBalanceMutation: BalanceMutation = {
      type: 'asset',
      vTokenAddress: xvsLiquidityHub.vhToken.address,
      action: 'supply',
      amountTokens: new BigNumber(10),
    };

    const { result } = renderUseSimulateLiquidityHubMutations({
      balanceMutations: [
        assetBalanceMutation,
        createLiquidityHubBalanceMutation({
          vhTokenAddress: '0x0000000000000000000000000000000000000000',
        }),
      ],
    });

    expect(result.current.liquidityHubs[0]).toBe(xvsLiquidityHub);
    expect(result.current.liquidityHubs[1]).toBe(usdcLiquidityHub);
  });

  it('simulates supply mutations', () => {
    const { result } = renderUseSimulateLiquidityHubMutations({
      balanceMutations: [createLiquidityHubBalanceMutation()],
    });

    const simulatedLiquidityHub = result.current.liquidityHubs[0];

    expect(simulatedLiquidityHub.supplyBalanceTokens.toFixed()).toBe('15260');
    expect(simulatedLiquidityHub.supplyBalanceCents.toFixed()).toBe('10910900');
    expect(simulatedLiquidityHub.userSupplyBalanceTokens?.toFixed()).toBe('52');
    expect(simulatedLiquidityHub.userSupplyBalanceCents?.toFixed()).toBe('37180');
    expect(simulatedLiquidityHub.userYearlyEarningsCents?.toFixed()).toBe('2751.32');
    expect(simulatedLiquidityHub.userVhTokenBalanceTokens?.toFixed()).toBe(
      new BigNumber(52).dividedBy(xvsLiquidityHub.pricePerShare).toFixed(),
    );
  });

  it('simulates withdraw mutations', () => {
    const { result } = renderUseSimulateLiquidityHubMutations({
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          action: 'withdraw',
          amountTokens: new BigNumber(10),
        }),
      ],
    });

    const simulatedLiquidityHub = result.current.liquidityHubs[0];

    expect(simulatedLiquidityHub.supplyBalanceTokens.toFixed()).toBe('15240');
    expect(simulatedLiquidityHub.supplyBalanceCents.toFixed()).toBe('10896600');
    expect(simulatedLiquidityHub.userSupplyBalanceTokens?.toFixed()).toBe('32');
    expect(simulatedLiquidityHub.userSupplyBalanceCents?.toFixed()).toBe('22880');
    expect(simulatedLiquidityHub.userYearlyEarningsCents?.toFixed()).toBe('1693.12');
    expect(simulatedLiquidityHub.userVhTokenBalanceTokens?.toFixed()).toBe(
      new BigNumber(32).dividedBy(xvsLiquidityHub.pricePerShare).toFixed(),
    );
  });

  it('clamps withdrawn liquidity hub and user balances at zero', () => {
    const { result } = renderUseSimulateLiquidityHubMutations({
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          action: 'withdraw',
          amountTokens: new BigNumber(20000),
        }),
      ],
    });

    const simulatedLiquidityHub = result.current.liquidityHubs[0];

    expect(simulatedLiquidityHub.supplyBalanceTokens.toFixed()).toBe('0');
    expect(simulatedLiquidityHub.supplyBalanceCents.toFixed()).toBe('0');
    expect(simulatedLiquidityHub.userSupplyBalanceTokens?.toFixed()).toBe('0');
    expect(simulatedLiquidityHub.userSupplyBalanceCents?.toFixed()).toBe('0');
    expect(simulatedLiquidityHub.userYearlyEarningsCents?.toFixed()).toBe('0');
    expect(simulatedLiquidityHub.userVhTokenBalanceTokens?.toFixed()).toBe('0');
  });

  it('applies multiple liquidity hub mutations in order', () => {
    const { result } = renderUseSimulateLiquidityHubMutations({
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          action: 'supply',
          amountTokens: new BigNumber(8),
        }),
        createLiquidityHubBalanceMutation({
          action: 'withdraw',
          amountTokens: new BigNumber(5),
        }),
        createLiquidityHubBalanceMutation({
          vhTokenAddress: usdcLiquidityHub.vhToken.address,
          action: 'supply',
          amountTokens: new BigNumber(100),
        }),
      ],
    });

    const simulatedXvsLiquidityHub = result.current.liquidityHubs[0];
    const simulatedUsdcLiquidityHub = result.current.liquidityHubs[1];

    expect(simulatedXvsLiquidityHub.supplyBalanceTokens.toFixed()).toBe('15253');
    expect(simulatedXvsLiquidityHub.supplyBalanceCents.toFixed()).toBe('10905895');
    expect(simulatedXvsLiquidityHub.userSupplyBalanceTokens?.toFixed()).toBe('45');
    expect(simulatedXvsLiquidityHub.userSupplyBalanceCents?.toFixed()).toBe('32175');
    expect(simulatedXvsLiquidityHub.userYearlyEarningsCents?.toFixed()).toBe('2380.95');
    expect(simulatedXvsLiquidityHub.userVhTokenBalanceTokens?.toFixed()).toBe(
      new BigNumber(45).dividedBy(xvsLiquidityHub.pricePerShare).toFixed(),
    );

    expect(simulatedUsdcLiquidityHub.supplyBalanceTokens.toFixed()).toBe('350100');
    expect(simulatedUsdcLiquidityHub.supplyBalanceCents.toFixed()).toBe('35010000');
    expect(simulatedUsdcLiquidityHub.userSupplyBalanceTokens?.toFixed()).toBe('1300');
    expect(simulatedUsdcLiquidityHub.userSupplyBalanceCents?.toFixed()).toBe('130000');
    expect(simulatedUsdcLiquidityHub.userYearlyEarningsCents?.toFixed()).toBe('6305');
    expect(simulatedUsdcLiquidityHub.userVhTokenBalanceTokens?.toFixed()).toBe(
      new BigNumber(1300).dividedBy(usdcLiquidityHub.pricePerShare).toFixed(),
    );
  });

  it('treats undefined user balances as zero', () => {
    const liquidityHubWithoutUserBalances: LiquidityHub = {
      ...xvsLiquidityHub,
      userSupplyBalanceTokens: undefined,
      userSupplyBalanceCents: undefined,
      userYearlyEarningsCents: undefined,
      userVhTokenBalanceTokens: undefined,
    };

    const { result } = renderUseSimulateLiquidityHubMutations({
      customLiquidityHubs: [liquidityHubWithoutUserBalances],
      balanceMutations: [createLiquidityHubBalanceMutation()],
    });

    const simulatedLiquidityHub = result.current.liquidityHubs[0];

    expect(simulatedLiquidityHub.supplyBalanceTokens.toFixed()).toBe('15260');
    expect(simulatedLiquidityHub.supplyBalanceCents.toFixed()).toBe('10910900');
    expect(simulatedLiquidityHub.userSupplyBalanceTokens?.toFixed()).toBe('10');
    expect(simulatedLiquidityHub.userSupplyBalanceCents?.toFixed()).toBe('7150');
    expect(simulatedLiquidityHub.userYearlyEarningsCents?.toFixed()).toBe('529.1');
    expect(simulatedLiquidityHub.userVhTokenBalanceTokens?.toFixed()).toBe(
      new BigNumber(10).dividedBy(xvsLiquidityHub.pricePerShare).toFixed(),
    );
  });
});
