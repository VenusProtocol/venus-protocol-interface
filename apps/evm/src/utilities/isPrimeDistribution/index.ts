import type { TokenDistribution } from 'types';

export const isPrimeDistribution = (distribution: TokenDistribution) =>
  distribution.type === 'prime' || distribution.type === 'primeSimulation';
