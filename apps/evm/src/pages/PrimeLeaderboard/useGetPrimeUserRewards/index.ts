import BigNumber from 'bignumber.js';
import { useGetPrimeCurrentCycle, useGetPrimeUserPendingRewards } from 'clients/api';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import {
  areAddressesEqual,
  compareTokensBySymbol,
  convertUsdMantissaToCents,
  findTokenByAddress,
} from 'utilities';

import type { PrimeRewardSide, UserMarketReward } from '../UserRewardsCard';

export interface UseGetPrimeUserRewardsOutput {
  isLoading: boolean;
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

  const marketRewards = (byRewardToken ?? [])
    .flatMap(({ rewardTokenAddress }) => {
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
        (total, reward) =>
          total + convertUsdMantissaToCents(reward.currentCycleUsdMantissa).toNumber(),
        0,
      );

      const emissionConfigs = tokenRewards.flatMap(
        ({
          tokenDistributionSpeedMantissa,
          supplyMultiplierMantissa,
          borrowMultiplierMantissa,
        }) => {
          if (
            tokenDistributionSpeedMantissa === undefined ||
            supplyMultiplierMantissa === undefined ||
            borrowMultiplierMantissa === undefined
          ) {
            return [];
          }

          return [
            { tokenDistributionSpeedMantissa, supplyMultiplierMantissa, borrowMultiplierMantissa },
          ];
        },
      );

      // The emission config is not served on every environment yet, so anything short of a full set
      // on every entry keeps the market rendered the way it was before the card became side-aware.
      if (emissionConfigs.length !== tokenRewards.length) {
        return [{ token, marketAddress, rewardsCents }];
      }

      const isSupplyIncentivized = emissionConfigs.some(
        ({ tokenDistributionSpeedMantissa, supplyMultiplierMantissa }) =>
          new BigNumber(tokenDistributionSpeedMantissa).isGreaterThan(0) &&
          new BigNumber(supplyMultiplierMantissa).isGreaterThan(0),
      );
      const isBorrowIncentivized = emissionConfigs.some(
        ({ tokenDistributionSpeedMantissa, borrowMultiplierMantissa }) =>
          new BigNumber(tokenDistributionSpeedMantissa).isGreaterThan(0) &&
          new BigNumber(borrowMultiplierMantissa).isGreaterThan(0),
      );

      let side: PrimeRewardSide = 'supply';
      if (isSupplyIncentivized && isBorrowIncentivized) {
        side = 'both';
      } else if (isBorrowIncentivized) {
        side = 'borrow';
      }

      return [{ token, marketAddress, rewardsCents, side }];
    })
    .sort((a, b) => compareTokensBySymbol(a.token, b.token));

  const totalRewardsCents = userPendingRewards
    ? convertUsdMantissaToCents(userPendingRewards.totalCurrentCycleUsdMantissa).toNumber()
    : 0;

  return {
    isLoading: isCurrentCycleLoading || isUserPendingRewardsLoading,
    totalRewardsCents,
    marketRewards,
  };
};
