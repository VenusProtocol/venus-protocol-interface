import BigNumber from 'bignumber.js';

export const useGetUserPrimeInfo = vi.fn(() => ({
  isLoading: false,
  data: {
    isUserPrime: false,
    claimWaitingPeriodSeconds: undefined,
    userClaimTimeRemainingSeconds: undefined,
    userHighestPrimeSimulationApyBoostPercentage: undefined,
    primeTokenLimit: undefined,
    claimedPrimeTokenCount: undefined,
    userStakedXvsTokens: new BigNumber(0),
    minXvsToStakeForPrimeTokens: new BigNumber(0),
  },
}));
