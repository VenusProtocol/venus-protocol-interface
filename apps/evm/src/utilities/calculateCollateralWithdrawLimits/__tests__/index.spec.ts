import BigNumber from 'bignumber.js';

import { fakeAsset, fakePool } from 'containers/MarketForm/WithdrawForm/__testUtils__/fakeData';
import {
  type CalculateCollateralWithdrawLimitsOutput,
  calculateCollateralWithdrawLimits,
} from '..';

const expectLimitsToEqual = (
  limits: CalculateCollateralWithdrawLimitsOutput,
  {
    limitTokens,
    safeLimitTokens,
    moderateRiskMaxTokens,
  }: {
    limitTokens: BigNumber;
    safeLimitTokens: BigNumber;
    moderateRiskMaxTokens: BigNumber;
  },
) => {
  expect(limits.limitTokens.isEqualTo(limitTokens)).toBe(true);
  expect(limits.safeLimitTokens.isEqualTo(safeLimitTokens)).toBe(true);
  expect(limits.moderateRiskMaxTokens.isEqualTo(moderateRiskMaxTokens)).toBe(true);
};

describe('utilities/calculateCollateralWithdrawLimits', () => {
  test('returns user supply balance when that is the limiting factor', () => {
    const limits = calculateCollateralWithdrawLimits({
      asset: {
        ...fakeAsset,
        userSupplyBalanceTokens: new BigNumber(1),
      },
      pool: fakePool,
    });

    expectLimitsToEqual(limits, {
      limitTokens: new BigNumber(1),
      safeLimitTokens: new BigNumber(1),
      moderateRiskMaxTokens: new BigNumber(1),
    });
  });

  test('returns asset liquidity when that is the limiting factor', () => {
    const limits = calculateCollateralWithdrawLimits({
      asset: {
        ...fakeAsset,
        tokenPriceCents: new BigNumber(1),
        tokenSupplyPriceCents: new BigNumber(1),
        liquidityCents: new BigNumber(60),
        userSupplyBalanceTokens: new BigNumber(100),
      },
      pool: {
        ...fakePool,
        userBorrowLimitProtectedCents: new BigNumber(1000000),
      },
    });

    expectLimitsToEqual(limits, {
      limitTokens: new BigNumber(60),
      safeLimitTokens: new BigNumber(60),
      moderateRiskMaxTokens: new BigNumber(60),
    });
  });

  test('returns borrow-limit-based max when borrow capacity is the limiting factor', () => {
    const limits = calculateCollateralWithdrawLimits({
      asset: {
        ...fakeAsset,
        userCollateralFactor: 1,
        tokenSupplyPriceCents: new BigNumber(100),
        userSupplyBalanceTokens: new BigNumber(1000),
      },
      pool: {
        ...fakePool,
        userBorrowLimitProtectedCents: new BigNumber(1000),
        userBorrowBalanceProtectedCents: new BigNumber(10),
      },
    });

    expectLimitsToEqual(limits, {
      limitTokens: new BigNumber('9.9'),
      safeLimitTokens: new BigNumber('9.9'),
      moderateRiskMaxTokens: new BigNumber('9.9'),
    });
  });

  test('returns a safe limit below the hard limit when liquidation-threshold math is tighter', () => {
    const limits = calculateCollateralWithdrawLimits({
      asset: {
        ...fakeAsset,
        userCollateralFactor: 1,
        tokenPriceCents: new BigNumber(1),
        tokenSupplyPriceCents: new BigNumber(1),
        userSupplyBalanceTokens: new BigNumber(1000),
      },
      pool: {
        ...fakePool,
        userBorrowBalanceCents: new BigNumber(100),
        userBorrowBalanceProtectedCents: new BigNumber(100),
        userBorrowLimitProtectedCents: new BigNumber(100000),
        userLiquidationThresholdCents: new BigNumber(200),
      },
    });

    expectLimitsToEqual(limits, {
      limitTokens: new BigNumber(1000),
      safeLimitTokens: new BigNumber(70),
      moderateRiskMaxTokens: new BigNumber(75),
    });
  });

  test('returns zero limits when protected borrow limit is already exhausted', () => {
    const limits = calculateCollateralWithdrawLimits({
      asset: fakeAsset,
      pool: {
        ...fakePool,
        userBorrowBalanceProtectedCents: new BigNumber(1000),
        userBorrowLimitProtectedCents: new BigNumber(1000),
      },
    });

    expectLimitsToEqual(limits, {
      limitTokens: new BigNumber(0),
      safeLimitTokens: new BigNumber(0),
      moderateRiskMaxTokens: new BigNumber(0),
    });
  });

  test('returns full available amount when user has no borrow balance', () => {
    const limits = calculateCollateralWithdrawLimits({
      asset: {
        ...fakeAsset,
        userSupplyBalanceTokens: new BigNumber(25),
      },
      pool: {
        ...fakePool,
        userBorrowBalanceCents: new BigNumber(0),
      },
    });

    expectLimitsToEqual(limits, {
      limitTokens: new BigNumber(25),
      safeLimitTokens: new BigNumber(25),
      moderateRiskMaxTokens: new BigNumber(25),
    });
  });
});
