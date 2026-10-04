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
});
