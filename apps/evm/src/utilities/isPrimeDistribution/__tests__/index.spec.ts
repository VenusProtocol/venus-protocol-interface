import BigNumber from 'bignumber.js';

import { xvs } from '__mocks__/models/tokens';

import { isPrimeDistribution } from '..';

describe('isPrimeDistribution', () => {
  it('matches Prime and Prime simulation distributions only', () => {
    const base = { token: xvs, apyPercentage: new BigNumber(1), isActive: true };

    expect(isPrimeDistribution({ ...base, type: 'prime' })).toBe(true);
    expect(
      isPrimeDistribution({
        ...base,
        type: 'primeSimulation',
        referenceValues: {
          userSupplyBalanceTokens: new BigNumber(1),
          userBorrowBalanceTokens: new BigNumber(0),
          userXvsStakedTokens: new BigNumber(1),
        },
      }),
    ).toBe(true);
    expect(
      isPrimeDistribution({ ...base, type: 'venus', dailyDistributedTokens: new BigNumber(0) }),
    ).toBe(false);
  });
});
