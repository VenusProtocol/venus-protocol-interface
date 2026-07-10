import { useMemo } from 'react';

import { useGetPrimeCurrentCycle } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import { convertUsdMantissaToCents, findTokenByAddress } from 'utilities';

import type { MarketReward } from '../TotalRewardsCard';

export interface UseGetPrimeTotalRewardsOutput {
  isLoading: boolean;
  totalRewardsCents: number;
  totalEstimatedRewardsCents: number;
  marketRewards: MarketReward[];
}

export const useGetPrimeTotalRewards = (): UseGetPrimeTotalRewardsOutput => {
  const tokens = useGetTokens();
  const { data: currentCycle, isLoading } = useGetPrimeCurrentCycle();

  const pendingPool = currentCycle?.pendingPool;

  const marketRewards = useMemo<MarketReward[]>(
    () =>
      (pendingPool?.byRewardToken ?? []).flatMap(
        ({ rewardTokenAddress, totalCurrentCycleUsdMantissa }) => {
          const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
          return token
            ? [
                {
                  token,
                  rewardsCents: convertUsdMantissaToCents(totalCurrentCycleUsdMantissa).toNumber(),
                },
              ]
            : [];
        },
      ),
    [pendingPool, tokens],
  );

  return {
    isLoading,
    totalRewardsCents: pendingPool
      ? convertUsdMantissaToCents(pendingPool.totalCurrentCycleUsdMantissa).toNumber()
      : 0,
    totalEstimatedRewardsCents: pendingPool
      ? convertUsdMantissaToCents(pendingPool.currentEstimatedTotalUsdMantissa).toNumber()
      : 0,
    marketRewards,
  };
};
