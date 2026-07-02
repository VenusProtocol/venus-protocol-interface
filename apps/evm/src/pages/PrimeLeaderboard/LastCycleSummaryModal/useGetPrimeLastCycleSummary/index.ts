import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetPrimeUserCycleRewards } from 'clients/api';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { convertMantissaToTokens, convertUsdMantissaToCents, findTokenByAddress } from 'utilities';

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
      (userCycleRewards?.markets ?? []).flatMap(market => {
        const token = findTokenByAddress({ address: market.rewardTokenAddress, tokens });
        if (!token) {
          return [];
        }

        return [
          {
            token,
            marketAddress: market.marketAddress,
            rewardsCents: convertUsdMantissaToCents(market.totalRewardUsdMantissa).toNumber(),
          },
        ];
      }),
    [userCycleRewards, tokens],
  );

  const totalRewardsCents = userCycleRewards?.totalRewardUsdMantissa
    ? convertUsdMantissaToCents(userCycleRewards.totalRewardUsdMantissa).toNumber()
    : 0;

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
