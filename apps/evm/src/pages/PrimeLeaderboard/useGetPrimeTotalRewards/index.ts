import { useGetTokens } from 'libs/tokens';

import type { MarketReward } from '../TotalRewardsCard';

export interface UseGetPrimeTotalRewardsOutput {
  totalRewardsCents: number;
  marketRewards: MarketReward[];
}

// TODO: replace these placeholder values with the data returned by the API
const placeholderTotalRewardsCents = 46_230_000;
const placeholderMarketRewardsCents = [28_040_000, 17_190_000];

export const useGetPrimeTotalRewards = (): UseGetPrimeTotalRewardsOutput => {
  const tokens = useGetTokens();

  // TODO: replace these placeholder tokens with the real Prime markets returned by the API
  const marketRewards = tokens
    .slice(0, placeholderMarketRewardsCents.length)
    .map((token, index) => ({ token, rewardsCents: placeholderMarketRewardsCents[index] }));

  return {
    totalRewardsCents: placeholderTotalRewardsCents,
    marketRewards,
  };
};
