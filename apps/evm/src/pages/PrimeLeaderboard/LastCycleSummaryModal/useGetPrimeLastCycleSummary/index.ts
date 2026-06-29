import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetPools, useGetPrimeUserCycleRewards } from 'clients/api';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities';

import type { UserMarketReward } from '../../UserRewardsCard';
import { buildPrimeMarketRewards } from '../../buildPrimeMarketRewards';
import { resolvePrimeTotalRewardCents } from '../../resolvePrimeTotalRewardCents';

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
  const { data: getPoolsData } = useGetPools({ accountAddress });

  const marketRewards = useMemo<UserMarketReward[]>(() => {
    const assets = getPoolsData?.pools.flatMap(pool => pool.assets) ?? [];

    const groups = (userCycleRewards?.markets ?? []).map(market => ({
      rewardTokenAddress: market.rewardTokenAddress,
      marketAddress: market.marketAddress,
      entries: [
        {
          marketAddress: market.marketAddress,
          amountMantissa: market.totalRewardMantissa,
          fallbackCents: Number(market.totalRewardCents),
        },
      ],
    }));

    return buildPrimeMarketRewards({ groups, assets, tokens });
  }, [userCycleRewards, getPoolsData, tokens]);

  const apiTotalCents = userCycleRewards?.totalRewardCents
    ? Number(userCycleRewards.totalRewardCents)
    : 0;
  const totalRewardsCents = resolvePrimeTotalRewardCents({ apiTotalCents, marketRewards });

  return {
    isLoading,
    rank: userCycleRewards?.rank ?? undefined,
    primeScore: userCycleRewards?.effectiveStakeMantissa
      ? convertMantissaToTokens({
          value: new BigNumber(userCycleRewards.effectiveStakeMantissa),
          token: xvs,
        })
      : undefined,
    totalRewardsCents,
    marketRewards,
  };
};
