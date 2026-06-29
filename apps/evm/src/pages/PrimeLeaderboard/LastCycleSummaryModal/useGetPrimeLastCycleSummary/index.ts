import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetPools, useGetPrimeUserCycleRewards } from 'clients/api';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { areAddressesEqual, convertMantissaToTokens, findTokenByAddress } from 'utilities';

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
  const { data: getPoolsData } = useGetPools({ accountAddress });

  const marketRewards = useMemo<UserMarketReward[]>(() => {
    const assets = getPoolsData?.pools.flatMap(pool => pool.assets) ?? [];

    return (userCycleRewards?.markets ?? []).flatMap(market => {
      const token = findTokenByAddress({ address: market.rewardTokenAddress, tokens });
      if (!token) {
        return [];
      }

      const asset = assets.find(poolAsset =>
        areAddressesEqual(poolAsset.vToken.address, market.marketAddress),
      );
      const amountTokens = convertMantissaToTokens({
        value: new BigNumber(market.totalRewardMantissa),
        token,
      });
      const rewardsCents =
        asset && amountTokens
          ? amountTokens.multipliedBy(asset.tokenPriceCents).toNumber()
          : Number(market.totalRewardCents);

      return [{ token, marketAddress: market.marketAddress, rewardsCents }];
    });
  }, [userCycleRewards, getPoolsData, tokens]);

  const apiTotalCents = userCycleRewards?.totalRewardCents
    ? Number(userCycleRewards.totalRewardCents)
    : 0;
  const detailTotalCents = marketRewards.reduce(
    (total, { rewardsCents }) => total + rewardsCents,
    0,
  );

  // use the api total if it's greater than 1, otherwise use the detail total, since API returns 0 for small rewards
  const totalRewardsCents = apiTotalCents >= 1 ? apiTotalCents : detailTotalCents;

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
