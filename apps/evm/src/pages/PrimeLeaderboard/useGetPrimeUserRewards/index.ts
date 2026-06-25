import { useMemo } from 'react';

import { useGetPrimeCurrentCycle, useGetPrimeUserPendingRewards } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { areAddressesEqual, findTokenByAddress } from 'utilities';

import type { UserMarketReward } from '../UserRewardsCard';

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

  const byRewardToken = currentCycle?.pendingPool?.byRewardToken;
  const userRewards = userPendingRewards?.rewards;

  const marketRewards = useMemo<UserMarketReward[]>(
    () =>
      (byRewardToken ?? []).flatMap(({ rewardTokenAddress }) => {
        const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
        if (!token) {
          return [];
        }

        const tokenRewards = (userRewards ?? []).filter(reward =>
          areAddressesEqual(reward.rewardTokenAddress, rewardTokenAddress),
        );

        const marketAddress = tokenRewards[0]?.marketAddress;
        if (!marketAddress) {
          return [];
        }

        const rewardsCents = tokenRewards.reduce(
          (total, reward) => total + Number(reward.pendingCents),
          0,
        );

        return [{ token, marketAddress, rewardsCents }];
      }),
    [byRewardToken, userRewards, tokens],
  );

  return {
    isLoading: isCurrentCycleLoading || isUserPendingRewardsLoading,
    isPrime: userPendingRewards?.isPrimeHolder ?? false,
    totalRewardsCents: userPendingRewards ? Number(userPendingRewards.totalPendingCents) : 0,
    marketRewards,
  };
};
