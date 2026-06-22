import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetPrimeCycle, useGetPrimeUserCycleRewards } from 'clients/api';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { areAddressesEqual, convertMantissaToTokens, findTokenByAddress } from 'utilities';

import type { UserMarketReward } from '../../UserRewardsCard';

export interface UseGetPrimeLastCycleSummaryOutput {
  rank?: number;
  primeScore?: BigNumber;
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
}

export const useGetPrimeLastCycleSummary = (): UseGetPrimeLastCycleSummaryOutput => {
  const { accountAddress } = useAccountAddress();
  const tokens = useGetTokens();
  const xvs = useGetToken({ symbol: 'XVS' });

  const { data: pastCycle } = useGetPrimeCycle({ cycleIndex: 'latest' });
  const cycleIndex = pastCycle?.cycle?.cycleIndex;

  const { data: userCycleRewards } = useGetPrimeUserCycleRewards(
    { cycleIndex: cycleIndex ?? 0, accountAddress },
    { enabled: cycleIndex !== undefined && !!accountAddress },
  );

  const rankingEntry = accountAddress
    ? pastCycle?.ranking.find(entry => areAddressesEqual(entry.userAddress, accountAddress))
    : undefined;

  const marketRewards = useMemo<UserMarketReward[]>(
    () =>
      (userCycleRewards?.markets ?? []).flatMap(({ rewardTokenAddress, totalRewardCents }) => {
        const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
        return token ? [{ token, rewardsCents: Number(totalRewardCents) }] : [];
      }),
    [userCycleRewards, tokens],
  );

  return {
    rank: rankingEntry?.finalRank,
    primeScore: rankingEntry
      ? convertMantissaToTokens({
          value: new BigNumber(rankingEntry.finalEffectiveStakeMantissa),
          token: xvs,
        })
      : undefined,
    totalRewardsCents: userCycleRewards?.totalRewardCents
      ? Number(userCycleRewards.totalRewardCents)
      : 0,
    marketRewards,
  };
};
