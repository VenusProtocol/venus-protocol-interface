import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import { useGetSimulatedPool } from 'clients/api';
import { renderHook } from 'testUtils/render';
import type { BalanceMutation, Pool } from 'types';

import { useSimulateYieldPlusMutations } from '..';

const position = yieldPlusPositions[0];

const balanceMutations: BalanceMutation[] = [
  {
    type: 'asset',
    action: 'withdraw',
    vTokenAddress: position.dsaAsset.vToken.address,
    amountTokens: new BigNumber(1),
  },
];

const makeSimulatedPool = ({
  dsaBalanceTokens = position.dsaBalanceTokens,
  longBalanceTokens = position.longBalanceTokens,
  shortBalanceTokens = position.shortBalanceTokens,
}: {
  dsaBalanceTokens?: BigNumber;
  longBalanceTokens?: BigNumber;
  shortBalanceTokens?: BigNumber;
} = {}): Pool => ({
  ...position.pool,
  assets: position.pool.assets.map(asset => {
    if (asset.vToken.address === position.dsaAsset.vToken.address) {
      return {
        ...asset,
        userSupplyBalanceTokens: dsaBalanceTokens,
        userSupplyBalanceCents: dsaBalanceTokens.multipliedBy(asset.tokenPriceCents).dp(0),
      };
    }

    if (asset.vToken.address === position.longAsset.vToken.address) {
      return {
        ...asset,
        userSupplyBalanceTokens: longBalanceTokens,
        userSupplyBalanceCents: longBalanceTokens.multipliedBy(asset.tokenPriceCents).dp(0),
      };
    }

    if (asset.vToken.address === position.shortAsset.vToken.address) {
      return {
        ...asset,
        userBorrowBalanceTokens: shortBalanceTokens,
        userBorrowBalanceCents: shortBalanceTokens.multipliedBy(asset.tokenPriceCents).dp(0),
      };
    }

    return asset;
  }),
});

describe('useSimulateYieldPlusMutations', () => {
  beforeEach(() => {
    (useGetSimulatedPool as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  it('passes the pool and balance mutations to useGetSimulatedPool and preserves the query state', () => {
    const error = new Error('Failed to simulate');

    (useGetSimulatedPool as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error,
    });

    const { result } = renderHook(() =>
      useSimulateYieldPlusMutations({
        balanceMutations,
        position,
      }),
    );

    expect(useGetSimulatedPool).toHaveBeenCalledWith({
      pool: position.pool,
      balanceMutations,
    });

    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
      error,
    });
  });

  it('includes dsaAmountTokens when formatting the simulated position', () => {
    const dsaAmountTokens = new BigNumber(5);

    (useGetSimulatedPool as Mock).mockReturnValue({
      data: {
        pool: makeSimulatedPool({
          dsaBalanceTokens: position.dsaBalanceTokens.plus(dsaAmountTokens),
        }),
      },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useSimulateYieldPlusMutations({
        balanceMutations,
        position,
        dsaAmountTokens,
      }),
    );

    expect(result.current.data?.position.dsaBalanceTokens.isEqualTo(new BigNumber(95))).toBe(true);
  });

  it('recalculates the average entry price when the simulated position adds long and short exposure', () => {
    (useGetSimulatedPool as Mock).mockReturnValue({
      data: {
        pool: makeSimulatedPool({
          longBalanceTokens: position.longBalanceTokens.plus(20),
          shortBalanceTokens: position.shortBalanceTokens.plus(10),
        }),
      },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useSimulateYieldPlusMutations({
        balanceMutations,
        position,
      }),
    );

    expect(result.current.data?.position.entryPriceTokens.isEqualTo(new BigNumber(0.5))).toBe(true);
  });

  it('recalculates the entry price when only short exposure changes', () => {
    (useGetSimulatedPool as Mock).mockReturnValue({
      data: {
        pool: makeSimulatedPool({
          shortBalanceTokens: position.shortBalanceTokens.plus(10),
        }),
      },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useSimulateYieldPlusMutations({
        balanceMutations,
        position,
      }),
    );

    expect(result.current.data?.position.entryPriceTokens.isEqualTo(new BigNumber(0.6))).toBe(true);
  });
});
