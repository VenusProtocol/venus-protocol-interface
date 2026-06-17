import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetPrimePastCycle, useGetPrimeUserCycleRewards } from 'clients/api';
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

  const { data: pastCycle } = useGetPrimePastCycle({ cycleIndex: 'latest' });
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
      (userCycleRewards?.markets ?? []).flatMap(({ rewardTokenAddress, totalRewardUsdCents }) => {
        const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
        return token ? [{ token, rewardsCents: Number(totalRewardUsdCents) }] : [];
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
    totalRewardsCents: userCycleRewards?.totalRewardUsdCents
      ? Number(userCycleRewards.totalRewardUsdCents)
      : 0,
    marketRewards,
  };
};
