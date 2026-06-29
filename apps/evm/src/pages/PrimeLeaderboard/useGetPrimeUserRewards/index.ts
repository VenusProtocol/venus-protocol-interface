import { useMemo } from 'react';

import { useGetPools, useGetPrimeCurrentCycle, useGetPrimeUserPendingRewards } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { areAddressesEqual } from 'utilities';

import type { UserMarketReward } from '../UserRewardsCard';
import { buildPrimeMarketRewards } from '../buildPrimeMarketRewards';
import { resolvePrimeTotalRewardCents } from '../resolvePrimeTotalRewardCents';

export interface UseGetPrimeUserRewardsOutput {
  isLoading: boolean;
  isPrime: boolean;
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
}

export const useGetPrimeUserRewards = (): UseGetPrimeUserRewardsOutput => {
  const { accountAddress } = useAccountAddress();
  const tokens = useGetTokens();
  const { data: currentCycle, isLoading: isCurrentCycleLoading } = useGetPrimeCurrentCycle();
  const { data: userPendingRewards, isLoading: isUserPendingRewardsLoading } =
    useGetPrimeUserPendingRewards({ accountAddress });
  const { data: getPoolsData } = useGetPools({ accountAddress });

  const byRewardToken = currentCycle?.pendingPool?.byRewardToken;
  const userRewards = userPendingRewards?.rewards;

  const marketRewards = useMemo<UserMarketReward[]>(() => {
    const assets = getPoolsData?.pools.flatMap(pool => pool.assets) ?? [];

    const groups = (byRewardToken ?? []).map(({ rewardTokenAddress }) => {
      const tokenRewards = (userRewards ?? []).filter(reward =>
        areAddressesEqual(reward.rewardTokenAddress, rewardTokenAddress),
      );

      return {
        rewardTokenAddress,
        marketAddress: tokenRewards[0]?.marketAddress,
        entries: tokenRewards.map(reward => ({
          marketAddress: reward.marketAddress,
          amountMantissa: reward.pendingAmountMantissa,
          fallbackCents: Number(reward.pendingCents),
        })),
      };
    });

    return buildPrimeMarketRewards({ groups, assets, tokens });
  }, [byRewardToken, userRewards, getPoolsData, tokens]);

  const apiTotalCents = userPendingRewards ? Number(userPendingRewards.totalPendingCents) : 0;
  const totalRewardsCents = resolvePrimeTotalRewardCents({ apiTotalCents, marketRewards });

  return {
    isLoading: isCurrentCycleLoading || isUserPendingRewardsLoading,
    isPrime: userPendingRewards?.isPrimeHolder ?? false,
    totalRewardsCents,
    marketRewards,
  };
};
