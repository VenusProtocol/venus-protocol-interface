import BigNumber from 'bignumber.js';

import { spokePools } from '__mocks__/models/spokePools';

import { getBorrowLimits } from '..';

const spokePool = {
  ...spokePools[0],
  userBorrowLimitCents: new BigNumber(1_000_000_000),
  userBorrowLimitProtectedCents: new BigNumber(1_000_000_000),
  userBorrowBalanceCents: new BigNumber(0),
  userBorrowBalanceProtectedCents: new BigNumber(0),
  userLiquidationThresholdCents: new BigNumber(1_000_000_000),
};

const fixtureAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;

const asset = {
  ...fixtureAsset,
  cashTokens: new BigNumber(10_000),
  reserveTokens: new BigNumber(0),
  borrowBalanceTokens: new BigNumber(0),
  borrowCapTokens: new BigNumber(1_000_000),
};

describe('getBorrowLimits', () => {
  it('lends at most the cash when the market has no reserves', () => {
    const { limitTokens } = getBorrowLimits({ spokePool, asset });

    expect(limitTokens.toFixed()).toBe('10000');
  });

  it('holds back the reserves, which the contract does not lend out', () => {
    const { limitTokens } = getBorrowLimits({
      spokePool,
      asset: { ...asset, reserveTokens: new BigNumber(100) },
    });

    expect(limitTokens.toFixed()).toBe('9900');
  });

  it('counts the bad debt as borrowed against the borrow cap, as the Spoke comptroller does', () => {
    const toMantissa = (tokens: number) =>
      BigInt(new BigNumber(tokens).shiftedBy(asset.vToken.underlyingToken.decimals).toFixed());

    const { limitTokens } = getBorrowLimits({
      spokePool,
      asset: {
        ...asset,
        borrowBalanceTokens: new BigNumber(900),
        borrowCapTokens: new BigNumber(1_000),
        badDebtMantissa: toMantissa(60),
      },
    });

    expect(limitTokens.toFixed()).toBe('40');

    const { limitTokens: cappedLimitTokens } = getBorrowLimits({
      spokePool,
      asset: {
        ...asset,
        borrowBalanceTokens: new BigNumber(950),
        borrowCapTokens: new BigNumber(1_000),
        badDebtMantissa: toMantissa(60),
      },
    });

    expect(cappedLimitTokens.toFixed()).toBe('0');
  });

  it('holds back the reserves that accrue before the borrow is executed', () => {
    // Testnet vUSDT_HubSpoke, where SAFE MAX overshot the cash
    const { limitTokens } = getBorrowLimits({
      spokePool,
      asset: {
        ...asset,
        cashTokens: new BigNumber('4868.741969'),
        borrowBalanceTokens: new BigNumber('12090.775314'),
        borrowRatePerBlockMantissa: new BigNumber('1017930013'),
        reserveFactor: 0.1,
      },
    });

    // 12090.775314 x 1017930013e-18 x 0.1 x 1000 blocks
    const pendingReservesTokens = new BigNumber('0.0012307563072560099082');

    expect(limitTokens.isLessThan('4868.741969')).toBe(true);
    expect(
      new BigNumber('4868.741969')
        .minus(limitTokens)
        .minus(pendingReservesTokens)
        .abs()
        .isLessThan(1e-12),
    ).toBe(true);
  });

  it('does not hold anything back when nothing is borrowed', () => {
    const { limitTokens } = getBorrowLimits({
      spokePool,
      asset: {
        ...asset,
        borrowRatePerBlockMantissa: new BigNumber('1017930013'),
        reserveFactor: 0.1,
      },
    });

    expect(limitTokens.toFixed()).toBe('10000');
  });
});
