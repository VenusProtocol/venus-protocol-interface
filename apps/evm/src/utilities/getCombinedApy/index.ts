import BigNumber from 'bignumber.js';

import type { TokenDistribution } from 'types';

export interface GetCombinedApyInput {
  type: 'supply' | 'borrow';
  baseApyPercentage: BigNumber;
  tokenDistributions: TokenDistribution[];
}

const getCombinedApy = ({ type, baseApyPercentage, tokenDistributions }: GetCombinedApyInput) => {
  const { apyRewardsPercentage, apyPrimePercentage, apyPrimeSimulationPercentage } =
    tokenDistributions.reduce<{
      apyRewardsPercentage: BigNumber;
      apyPrimePercentage: BigNumber;
      apyPrimeSimulationPercentage: BigNumber;
    }>(
      (acc, distribution) => {
        if (!distribution.isActive) {
          return acc;
        }

        if (
          distribution.type === 'venus' ||
          distribution.type === 'merkl' ||
          distribution.type === 'intrinsic' ||
          distribution.type === 'off-chain' ||
          distribution.type === 'yield-to-maturity'
        ) {
          return {
            ...acc,
            apyRewardsPercentage: acc.apyRewardsPercentage.plus(distribution.apyPercentage),
          };
        }

        if (distribution.type === 'prime') {
          return {
            ...acc,
            apyPrimePercentage: acc.apyPrimePercentage.plus(distribution.apyPercentage),
          };
        }

        return {
          ...acc,
          apyPrimeSimulationPercentage: acc.apyPrimeSimulationPercentage.plus(
            distribution.apyPercentage,
          ),
        };
      },
      {
        apyRewardsPercentage: new BigNumber(0),
        apyPrimePercentage: new BigNumber(0),
        apyPrimeSimulationPercentage: new BigNumber(0),
      },
    );

  const totalApyBoostPercentage = apyRewardsPercentage.plus(apyPrimePercentage);
  const totalApyPercentage =
    type === 'supply'
      ? baseApyPercentage.plus(totalApyBoostPercentage)
      : baseApyPercentage.minus(totalApyBoostPercentage);

  return {
    apyRewardsPercentage,
    apyPrimePercentage,
    apyPrimeSimulationPercentage,
    totalApyBoostPercentage,
    totalApyPercentage,
  };
};

export default getCombinedApy;
