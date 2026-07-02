import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { PrimeVersion } from 'types';

export const usePrimeVersion = () => {
  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const isPrimeLeaderboardEnabled = useIsFeatureEnabled({
    name: 'primeLeaderboard',
  });

  const primeVersion: PrimeVersion = isPrimeLeaderboardEnabled ? 2 : 1;

  return { primeVersion: isPrimeEnabled ? primeVersion : undefined };
};
