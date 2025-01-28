import type BigNumber from 'bignumber.js';

import type { AssetDistribution, Token } from 'types';
import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';
import findTokenByAddress from 'utilities/findTokenByAddress';
import formatRewardDistribution from 'utilities/formatRewardDistribution';

import type { ApiRewardDistributor } from 'clients/api/queries/useGetPools/getPools/getApiPools';
import { convertPriceMantissaToDollars } from 'utilities';
import type { PrimeApy } from '../../../types';
import { isDistributingRewards } from './isDistributingRewards';

export type FormatDistributionsInput = {
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  apiRewardsDistributors: ApiRewardDistributor[];
  currentBlockNumber: bigint;
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
  underlyingToken: Token;
  primeApy?: PrimeApy;
  blocksPerDay?: number;
};

export const formatDistributions = ({
  blocksPerDay,
  underlyingTokenPriceDollars,
  tokens,
  apiRewardsDistributors,
  currentBlockNumber,
  supplyBalanceTokens,
  borrowBalanceTokens,
  underlyingToken,
  primeApy,
}: FormatDistributionsInput) => {
  const supplyDistributions: AssetDistribution[] = [];
  const borrowDistributions: AssetDistribution[] = [];

  const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(underlyingTokenPriceDollars);
  const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(underlyingTokenPriceDollars);

  apiRewardsDistributors.forEach(
    ({
      rewardType,
      rewardTokenAddress,
      lastRewardingSupplyBlockOrTimestamp,
      lastRewardingBorrowBlockOrTimestamp,
      supplySpeed,
      borrowSpeed,
      priceMantissa,
      rewardDetails,
    }) => {
      const rewardToken = findTokenByAddress({
        tokens,
        address: rewardTokenAddress,
      });

      if (!rewardToken) {
        return;
      }

      const isChainTimeBased = !blocksPerDay;
      const rewardTokenPriceDollars = convertPriceMantissaToDollars({
        priceMantissa,
        decimals: rewardToken.decimals,
      });

      const isDistributingSupplyRewards = isDistributingRewards({
        isTimeBased: isChainTimeBased,
        lastRewardingTimestamp: isChainTimeBased ? +lastRewardingSupplyBlockOrTimestamp : undefined,
        lastRewardingBlock: isChainTimeBased ? undefined : +lastRewardingSupplyBlockOrTimestamp,
        currentBlockNumber,
      });

      if (isDistributingSupplyRewards) {
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: supplySpeed,
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        supplyDistributions.push(
          formatRewardDistribution({
            rewardType,
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: supplyBalanceDollars,
            rewardDescription: rewardDetails?.description,
          }),
        );
      }

      const isDistributingBorrowRewards = isDistributingRewards({
        isTimeBased: isChainTimeBased,
        lastRewardingTimestamp: isChainTimeBased ? +lastRewardingBorrowBlockOrTimestamp : undefined,
        lastRewardingBlock: isChainTimeBased ? undefined : +lastRewardingBorrowBlockOrTimestamp,
        currentBlockNumber,
      });

      if (isDistributingBorrowRewards) {
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: borrowSpeed,
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        borrowDistributions.push(
          formatRewardDistribution({
            rewardType,
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: borrowBalanceDollars,
            rewardDescription: rewardDetails?.description,
          }),
        );
      }
    },
  );

  // Add Prime distributions
  if (primeApy) {
    supplyDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.supplyApy,
      token: underlyingToken,
    });

    borrowDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.borrowApy,
      token: underlyingToken,
    });
  }

  return {
    supplyDistributions,
    borrowDistributions,
  };
};
