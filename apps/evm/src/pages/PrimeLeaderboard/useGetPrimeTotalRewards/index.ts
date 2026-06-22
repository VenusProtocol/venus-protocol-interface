import { useMemo } from 'react';

import { useGetPrimeCurrentCycle } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import { findTokenByAddress } from 'utilities';

import type { MarketReward } from '../TotalRewardsCard';

export interface UseGetPrimeTotalRewardsOutput {
  isLoading: boolean;
  totalRewardsCents: number;
  marketRewards: MarketReward[];
}

export const useGetPrimeTotalRewards = (): UseGetPrimeTotalRewardsOutput => {
  const tokens = useGetTokens();
  const { data: currentCycle, isLoading } = useGetPrimeCurrentCycle();

  const pendingPool = currentCycle?.pendingPool;

  const marketRewards = useMemo<MarketReward[]>(
    () =>
      (pendingPool?.byRewardToken ?? []).flatMap(({ rewardTokenAddress, totalPendingCents }) => {
        const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
        return token ? [{ token, rewardsCents: Number(totalPendingCents) }] : [];
      }),
    [pendingPool, tokens],
  );

  return {
    isLoading,
    totalRewardsCents: pendingPool ? Number(pendingPool.totalPendingCents) : 0,
    marketRewards,
  };
};
