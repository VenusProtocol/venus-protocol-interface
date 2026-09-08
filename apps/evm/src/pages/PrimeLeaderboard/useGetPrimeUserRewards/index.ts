import BigNumber from 'bignumber.js';
import { useGetPrimeUserPendingRewards } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { compareTokensBySymbol, convertUsdMantissaToCents, findTokenByAddress } from 'utilities';

import type { PrimeRewardSide, UserMarketReward } from '../UserRewardsCard';

export interface UseGetPrimeUserRewardsOutput {
  isLoading: boolean;
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
}

export const useGetPrimeUserRewards = (): UseGetPrimeUserRewardsOutput => {
  const { accountAddress } = useAccountAddress();
  const tokens = useGetTokens();
  const { data: userPendingRewards, isLoading } = useGetPrimeUserPendingRewards({ accountAddress });

  // One row per market: Prime multipliers are configured per market, so a reward token shared by
  // several markets must not be collapsed into a single row.
  const marketRewards = (userPendingRewards?.rewards ?? [])
    .flatMap(
      ({
        marketAddress,
        rewardTokenAddress,
        currentCycleUsdMantissa,
        tokenDistributionSpeedMantissa,
        supplyMultiplierMantissa,
        borrowMultiplierMantissa,
      }) => {
        const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
        if (!token) {
          return [];
        }

        const rewardsCents = convertUsdMantissaToCents(currentCycleUsdMantissa).toNumber();

        // The emission config is not served on every environment yet, so an incomplete set keeps
        // the market rendered the way it was before the card became side-aware.
        if (
          tokenDistributionSpeedMantissa === undefined ||
          supplyMultiplierMantissa === undefined ||
          borrowMultiplierMantissa === undefined
        ) {
          return [{ token, marketAddress, rewardsCents }];
        }

        const isEmitting = new BigNumber(tokenDistributionSpeedMantissa).isGreaterThan(0);
        const isSupplyIncentivized =
          isEmitting && new BigNumber(supplyMultiplierMantissa).isGreaterThan(0);
        const isBorrowIncentivized =
          isEmitting && new BigNumber(borrowMultiplierMantissa).isGreaterThan(0);

        let side: PrimeRewardSide = 'supply';
        if (isSupplyIncentivized && isBorrowIncentivized) {
          side = 'both';
        } else if (isBorrowIncentivized) {
          side = 'borrow';
        }

        return [{ token, marketAddress, rewardsCents, side }];
      },
    )
    .sort((a, b) => compareTokensBySymbol(a.token, b.token));

  const totalRewardsCents = userPendingRewards
    ? convertUsdMantissaToCents(userPendingRewards.totalCurrentCycleUsdMantissa).toNumber()
    : 0;

  return {
    isLoading,
    totalRewardsCents,
    marketRewards,
  };
};
