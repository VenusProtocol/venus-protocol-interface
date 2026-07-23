import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { t } from 'libs/translations';
import type { BalanceMutation, LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import { validateLiquidityHubBalanceMutations } from '..';

const fakeLiquidityHub = liquidityHubs[0];

const updateLiquidityHub = (overrides: Partial<LiquidityHub>): LiquidityHub => ({
  ...fakeLiquidityHub,
  ...overrides,
});

const createLiquidityHubBalanceMutation = (
  overrides: Partial<LiquidityHubBalanceMutation> = {},
): LiquidityHubBalanceMutation => ({
  type: 'liquidityHub',
  action: 'supply',
  vhTokenAddress: fakeLiquidityHub.vhToken.address,
  amountTokens: new BigNumber(1),
  ...overrides,
});

describe('validateLiquidityHubBalanceMutations', () => {
  it('returns SUPPLY_CAP_ALREADY_REACHED when the Liquidity Hub supply cap has already been reached', () => {
    const result = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub: updateLiquidityHub({
        supplyBalanceTokens: new BigNumber(10),
        supplyCapTokens: new BigNumber(10),
      }),
      balanceMutations: [createLiquidityHubBalanceMutation()],
    });

    expect(result?.code).toBe('SUPPLY_CAP_ALREADY_REACHED');
  });

  it('returns HIGHER_THAN_SUPPLY_CAP when a supply mutation exceeds the Liquidity Hub supply cap', () => {
    const result = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub: updateLiquidityHub({
        supplyBalanceTokens: new BigNumber(9),
        supplyCapTokens: new BigNumber(10),
      }),
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          amountTokens: new BigNumber(2),
        }),
      ],
    });

    expect(result?.code).toBe('HIGHER_THAN_SUPPLY_CAP');
  });

  it('returns HIGHER_THAN_LIQUIDITY when a withdraw mutation exceeds Liquidity Hub liquidity', () => {
    const result = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub: updateLiquidityHub({
        liquidityTokens: new BigNumber(1),
        userSupplyBalanceTokens: new BigNumber(100),
      }),
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          action: 'withdraw',
          amountTokens: new BigNumber(2),
        }),
      ],
    });

    expect(result?.code).toBe('HIGHER_THAN_LIQUIDITY');
  });

  it('returns HIGHER_THAN_AVAILABLE_AMOUNT when a withdraw mutation exceeds the user supply balance', () => {
    const result = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub: updateLiquidityHub({
        liquidityTokens: new BigNumber(100),
        userSupplyBalanceTokens: new BigNumber(1),
      }),
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          action: 'withdraw',
          amountTokens: new BigNumber(2),
        }),
      ],
    });

    expect(result?.code).toBe('HIGHER_THAN_AVAILABLE_AMOUNT');
  });

  it('returns undefined when no error was found', () => {
    const result = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub: updateLiquidityHub({
        supplyBalanceTokens: new BigNumber(1),
        supplyCapTokens: new BigNumber(10),
      }),
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          amountTokens: new BigNumber(2),
        }),
      ],
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined for non-Liquidity Hub mutations', () => {
    const balanceMutation: BalanceMutation = {
      type: 'asset',
      action: 'supply',
      vTokenAddress: fakeLiquidityHub.vhToken.address,
      amountTokens: new BigNumber(1),
    };

    const result = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub: updateLiquidityHub({
        supplyBalanceTokens: new BigNumber(10),
        supplyCapTokens: new BigNumber(10),
      }),
      balanceMutations: [balanceMutation],
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined for Liquidity Hub mutations that target another vhToken', () => {
    const result = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub: updateLiquidityHub({
        supplyBalanceTokens: new BigNumber(10),
        supplyCapTokens: new BigNumber(10),
      }),
      balanceMutations: [
        createLiquidityHubBalanceMutation({
          vhTokenAddress: liquidityHubs[1].vhToken.address,
        }),
      ],
    });

    expect(result).toBeUndefined();
  });
});
