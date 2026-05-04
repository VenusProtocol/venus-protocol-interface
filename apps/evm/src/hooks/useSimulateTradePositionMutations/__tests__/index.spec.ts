import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { tradePositions } from '__mocks__/models/trade';
import { useGetSimulatedPool } from 'clients/api';
import { renderHook } from 'testUtils/render';
import type { BalanceMutation, Pool } from 'types';

import { useSimulateTradeMutations } from '..';

const position = tradePositions[0];

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

describe('useSimulateTradeMutations', () => {
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
      useSimulateTradeMutations({
        balanceMutations,
        position,
        action: 'increase',
      }),
    );

    expect(useGetSimulatedPool).toHaveBeenCalledWith({
      pool: position.pool,
      balanceMutations,
    });

    expect(result.current).toMatchObject({
      data: undefined,
      isLoading: true,
      error,
    });
  });

  it('uses the supplied DSA amount when the action is supplyDsa', () => {
    const dsaAmountTokens = new BigNumber(5);

    (useGetSimulatedPool as Mock).mockReturnValue({
      data: {
        pool: makeSimulatedPool(),
      },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useSimulateTradeMutations({
        balanceMutations,
        position,
        dsaAmountTokens,
        action: 'supplyDsa',
      }),
    );

    expect(
      result.current.data?.position.dsaBalanceTokens.isEqualTo(
        position.dsaBalanceTokens.plus(dsaAmountTokens),
      ),
    ).toBe(true);
  });

  it('uses the supplied DSA amount when the action is open', () => {
    const dsaAmountTokens = new BigNumber(5);

    (useGetSimulatedPool as Mock).mockReturnValue({
      data: {
        pool: makeSimulatedPool(),
      },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useSimulateTradeMutations({
        balanceMutations,
        position,
        dsaAmountTokens,
        action: 'open',
      }),
    );

    expect(
      result.current.data?.position.dsaBalanceTokens.isEqualTo(
        position.dsaBalanceTokens.plus(dsaAmountTokens),
      ),
    ).toBe(true);
  });

  it('uses the supplied DSA amount when the action is withdrawDsa', () => {
    const dsaAmountTokens = new BigNumber(5);

    (useGetSimulatedPool as Mock).mockReturnValue({
      data: {
        pool: makeSimulatedPool(),
      },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useSimulateTradeMutations({
        balanceMutations,
        position,
        dsaAmountTokens,
        action: 'withdrawDsa',
      }),
    );

    expect(
      result.current.data?.position.dsaBalanceTokens.isEqualTo(
        position.dsaBalanceTokens.minus(dsaAmountTokens),
      ),
    ).toBe(true);
  });

  it('clamps the DSA balance to zero when withdrawing more than the current balance', () => {
    const dsaAmountTokens = position.dsaBalanceTokens.plus(5);

    (useGetSimulatedPool as Mock).mockReturnValue({
      data: {
        pool: makeSimulatedPool({
          dsaBalanceTokens: new BigNumber(0),
        }),
      },
      isLoading: false,
    });

    const { result } = renderHook(() =>
      useSimulateTradeMutations({
        balanceMutations,
        position,
        dsaAmountTokens,
        action: 'withdrawDsa',
      }),
    );

    expect(result.current.data?.position.dsaBalanceTokens.isZero()).toBe(true);
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
      useSimulateTradeMutations({
        balanceMutations,
        position,
        action: 'increase',
      }),
    );

    const simulatedPosition = result.current.data?.position;

    expect(
      simulatedPosition?.longBalanceTokens.isEqualTo(position.longBalanceTokens.plus(20)),
    ).toBe(true);
    expect(
      simulatedPosition?.shortBalanceTokens.isEqualTo(position.shortBalanceTokens.plus(10)),
    ).toBe(true);
    expect(
      simulatedPosition?.entryPriceTokens.isEqualTo(
        simulatedPosition.shortBalanceTokens.div(simulatedPosition.longBalanceTokens),
      ),
    ).toBe(true);
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
      useSimulateTradeMutations({
        balanceMutations,
        position,
        action: 'increase',
      }),
    );

    const simulatedPosition = result.current.data?.position;

    expect(
      simulatedPosition?.shortBalanceTokens.isEqualTo(position.shortBalanceTokens.plus(10)),
    ).toBe(true);
    expect(
      simulatedPosition?.entryPriceTokens.isEqualTo(
        simulatedPosition.shortBalanceTokens.div(simulatedPosition.longBalanceTokens),
      ),
    ).toBe(true);
  });
});
