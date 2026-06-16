import { useGetTokens } from 'libs/tokens';

import type { UserMarketReward } from '../UserRewardsCard';

export interface UseGetPrimeUserRewardsOutput {
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
}

// TODO: replace these placeholder values with the data returned by the API
const placeholderTotalRewardsCents = 1_840_000;
const placeholderMarketRewardsCents = [1_140_000, 700_000];
const placeholderApyPercentage = 3.78;

export const useGetPrimeUserRewards = (): UseGetPrimeUserRewardsOutput => {
  const tokens = useGetTokens();

  // TODO: replace these placeholder tokens with the real Prime markets returned by the API
  const marketRewards = tokens
    .slice(0, placeholderMarketRewardsCents.length)
    .map((token, index) => ({
      token,
      rewardsCents: placeholderMarketRewardsCents[index],
      apyPercentage: placeholderApyPercentage,
    }));

  return {
    totalRewardsCents: placeholderTotalRewardsCents,
    marketRewards,
  };
};
