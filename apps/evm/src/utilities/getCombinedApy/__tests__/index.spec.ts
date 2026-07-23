import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import type { TokenDistribution } from 'types';
import getCombinedApy from '..';

const token = assetData[0].vToken.underlyingToken;

const tokenDistributions: TokenDistribution[] = [
  {
    type: 'venus',
    token,
    apyPercentage: new BigNumber(1),
    dailyDistributedTokens: new BigNumber(1),
    isActive: true,
  },
  {
    type: 'prime',
    token,
    apyPercentage: new BigNumber(2),
    isActive: true,
  },
  {
    type: 'primeSimulation',
    token,
    apyPercentage: new BigNumber(3),
    isActive: true,
    referenceValues: {
      userSupplyBalanceTokens: new BigNumber(0),
      userBorrowBalanceTokens: new BigNumber(0),
      userXvsStakedTokens: new BigNumber(0),
    },
  },
  {
    type: 'venus',
    token,
    apyPercentage: new BigNumber(100),
    dailyDistributedTokens: new BigNumber(1),
    isActive: false,
  },
];

describe('getCombinedApy', () => {
  it.each([
    {
      type: 'supply',
      expectedTotalApyPercentage: '5',
    },
    {
      type: 'borrow',
      expectedTotalApyPercentage: '-5',
    },
  ] as const)('calculates the combined $type APY', ({ type, expectedTotalApyPercentage }) => {
    const result = getCombinedApy({
      type,
      baseApyPercentage: new BigNumber(type === 'supply' ? 2 : -2),
      tokenDistributions,
    });

    expect(result.apyRewardsPercentage.toFixed()).toBe('1');
    expect(result.apyPrimePercentage.toFixed()).toBe('2');
    expect(result.apyPrimeSimulationPercentage.toFixed()).toBe('3');
    expect(result.totalApyBoostPercentage.toFixed()).toBe('3');
    expect(result.totalApyPercentage.toFixed()).toBe(expectedTotalApyPercentage);
  });
});
