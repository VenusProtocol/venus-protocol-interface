import BigNumber from 'bignumber.js';

import { isolatedPool, legacyCorePool } from '__mocks__/models/pools';
import { shouldShowAccountHealth } from '..';

describe('shouldShowAccountHealth', () => {
  it('returns true when the user has a borrow balance', () => {
    expect(shouldShowAccountHealth({ pool: legacyCorePool })).toBe(true);
  });

  it('returns true when the simulated pool has a borrow balance', () => {
    expect(
      shouldShowAccountHealth({
        pool: isolatedPool,
        simulatedPool: {
          ...isolatedPool,
          userBorrowBalanceCents: new BigNumber(1),
        },
      }),
    ).toBe(true);
  });

  it('returns false when there is no current or simulated borrow activity', () => {
    expect(shouldShowAccountHealth({ pool: isolatedPool })).toBe(false);
  });
});
