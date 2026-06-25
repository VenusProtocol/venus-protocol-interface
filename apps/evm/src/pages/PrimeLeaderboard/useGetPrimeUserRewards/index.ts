import { useGetTokens } from 'libs/tokens';

import type { UserMarketReward } from '../UserRewardsCard';

export interface UseGetPrimeUserRewardsOutput {
  isPrime: boolean;
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
}

// TODO: replace these placeholder values with the data returned by the API
const placeholderIsPrime = true;
const placeholderTotalRewardsCents = 1_840_000;
const placeholderMarketRewardsCents = [1_140_000, 700_000];

export const useGetPrimeUserRewards = (): UseGetPrimeUserRewardsOutput => {
  const tokens = useGetTokens();

  // TODO: replace these placeholder tokens with the real Prime markets returned by the API
  const marketRewards = tokens
    .slice(0, placeholderMarketRewardsCents.length)
    .map((token, index) => ({
      token,
      rewardsCents: placeholderMarketRewardsCents[index],
    }));

  return {
    isPrime: placeholderIsPrime,
    totalRewardsCents: placeholderTotalRewardsCents,
    marketRewards,
  };
};
