import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetPrimeUserCycleRewards } from 'clients/api';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { convertMantissaToTokens, findTokenByAddress } from 'utilities';

import type { UserMarketReward } from '../../UserRewardsCard';

export interface UseGetPrimeLastCycleSummaryOutput {
  isLoading: boolean;
  rank?: number;
  primeScore?: BigNumber;
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
}

export const useGetPrimeLastCycleSummary = (
  cycleIndex?: number,
): UseGetPrimeLastCycleSummaryOutput => {
  const { accountAddress } = useAccountAddress();
  const tokens = useGetTokens();
  const xvs = useGetToken({ symbol: 'XVS' });

  const { data: userCycleRewards, isLoading } = useGetPrimeUserCycleRewards(
    { cycleIndex: cycleIndex ?? 0, accountAddress },
    { enabled: cycleIndex !== undefined && !!accountAddress },
  );

  const marketRewards = useMemo<UserMarketReward[]>(
    () =>
      (userCycleRewards?.markets ?? []).flatMap(
        ({ marketAddress, rewardTokenAddress, totalRewardCents }) => {
          const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
          return token ? [{ token, marketAddress, rewardsCents: Number(totalRewardCents) }] : [];
        },
      ),
    [userCycleRewards, tokens],
  );

  return {
    isLoading,
    rank: userCycleRewards?.rank ?? undefined,
    primeScore: userCycleRewards?.effectiveStakeMantissa
      ? convertMantissaToTokens({
          value: new BigNumber(userCycleRewards.effectiveStakeMantissa),
          token: xvs,
        })
      : undefined,
    totalRewardsCents: userCycleRewards?.totalRewardCents
      ? Number(userCycleRewards.totalRewardCents)
      : 0,
    marketRewards,
  };
};
