import BigNumber from 'bignumber.js';

import { fakeAsset, fakePool } from 'containers/MarketForm/WithdrawForm/__testUtils__/fakeData';
import type { Asset, Pool } from 'types';
import { calculateCollateralMigrationLimits } from '..';

const asset: Asset = {
  ...fakeAsset,
  tokenPriceCents: new BigNumber(100),
  tokenSupplyPriceCents: new BigNumber(100),
  liquidityCents: new BigNumber(1_000_000_000),
  userSupplyBalanceTokens: new BigNumber(1000),
  isCollateralOfUser: true,
  userCollateralFactor: 0.8,
  userLiquidationThresholdPercentage: 85,
};

const vhAsset: Asset = {
  ...fakeAsset,
  userCollateralFactor: 0.75,
  userLiquidationThresholdPercentage: 80,
};

const pool: Pool = {
  ...fakePool,
  userBorrowBalanceCents: new BigNumber(10_000),
  userBorrowBalanceProtectedCents: new BigNumber(10_000),
  userBorrowLimitProtectedCents: new BigNumber(10_500),
  userLiquidationThresholdCents: new BigNumber(13_250),
};

const expectLimits = (
  limits: ReturnType<typeof calculateCollateralMigrationLimits>,
  limitTokens: number,
  safeLimitTokens: number,
) => {
  expect(limits.limitTokens.toFixed()).toBe(new BigNumber(limitTokens).toFixed());
  expect(limits.safeLimitTokens.toFixed()).toBe(new BigNumber(safeLimitTokens).toFixed());
};

describe('calculateCollateralMigrationLimits', () => {
  it('returns the whole supply when the asset is not used as collateral', () => {
    expectLimits(
      calculateCollateralMigrationLimits({
        asset: { ...asset, isCollateralOfUser: false },
        vhAsset,
        pool,
      }),
      1000,
      1000,
    );
  });

  it('returns the whole supply when the user has no borrow position', () => {
    expectLimits(
      calculateCollateralMigrationLimits({
        asset,
        vhAsset,
        pool: { ...pool, userBorrowBalanceCents: new BigNumber(0) },
      }),
      1000,
      1000,
    );
  });

  it('caps the available amount with the asset liquidity', () => {
    expectLimits(
      calculateCollateralMigrationLimits({
        asset: { ...asset, isCollateralOfUser: false, liquidityCents: new BigNumber(5000) },
        vhAsset,
        pool,
      }),
      50,
      50,
    );
  });

  it('returns the whole supply when the vhToken market has the same risk parameters', () => {
    expectLimits(
      calculateCollateralMigrationLimits({
        asset,
        vhAsset: { ...vhAsset, userCollateralFactor: 0.8, userLiquidationThresholdPercentage: 85 },
        pool,
      }),
      1000,
      1000,
    );
  });

  it('returns 0 when the user is already above their borrow limit', () => {
    expectLimits(
      calculateCollateralMigrationLimits({
        asset,
        vhAsset: { ...vhAsset, userCollateralFactor: 0.8, userLiquidationThresholdPercentage: 85 },
        pool: { ...pool, userBorrowLimitProtectedCents: new BigNumber(10_000) },
      }),
      0,
      0,
    );
  });

  it('limits the amount by the collateral factor and liquidation threshold drops', () => {
    // CF drop caps it at 100, LT drop at 50
    expectLimits(calculateCollateralMigrationLimits({ asset, vhAsset, pool }), 100, 50);
  });
});
