import type BigNumber from 'bignumber.js';

import { logError } from 'libs/errors';
import type { AssetDistribution, PrimeApy, Token } from 'types';
import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';
import findTokenByAddress from 'utilities/findTokenByAddress';
import formatRewardDistribution from 'utilities/formatRewardDistribution';

import type { RewardsDistributorSettingsResult } from '../getRewardsDistributorSettingsMapping';
import type { GetTokenPriceDollarsMappingOutput } from '../getTokenPriceDollarsMapping';
import { isDistributingRewards } from './isDistributingRewards';

export type FormatDistributionsInput = {
  underlyingToken: Token;
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  tokenPriceDollarsMapping: GetTokenPriceDollarsMappingOutput;
  rewardsDistributorSettings: RewardsDistributorSettingsResult[];
  currentBlockNumber: number;
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
  blocksPerDay?: number;
  primeApy?: PrimeApy;
};

const formatDistributions = ({
  blocksPerDay,
  underlyingToken,
  underlyingTokenPriceDollars,
  tokens,
  tokenPriceDollarsMapping,
  rewardsDistributorSettings,
  currentBlockNumber,
  supplyBalanceTokens,
  borrowBalanceTokens,
  primeApy,
}: FormatDistributionsInput) => {
  const supplyDistributions: AssetDistribution[] = [];
  const borrowDistributions: AssetDistribution[] = [];

  const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(underlyingTokenPriceDollars);
  const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(underlyingTokenPriceDollars);

  rewardsDistributorSettings.forEach(
    ({
      rewardTokenAddress,
      rewardTokenSupplyState,
      rewardTokenBorrowState,
      rewardTokenSupplySpeeds,
      rewardTokenBorrowSpeeds,
      rewardTokenBorrowStateTimeBased,
      rewardTokenSupplyStateTimeBased,
    }) => {
      const rewardToken = findTokenByAddress({
        tokens,
        address: rewardTokenAddress,
      });

      if (!rewardToken) {
        logError(`Record missing for reward token: ${rewardTokenAddress}`);
        return;
      }

      const rewardTokenPriceDollars = tokenPriceDollarsMapping[rewardToken.address.toLowerCase()];

      if (!rewardTokenPriceDollars) {
        return;
      }

      const isChainTimeBased = !blocksPerDay;

      const isDistributingSupplyRewards = isDistributingRewards({
        isTimeBased: isChainTimeBased,
        lastRewardingTimestamp: rewardTokenSupplyStateTimeBased?.lastRewardingTimestamp.toNumber(),
        lastRewardingBlock: rewardTokenSupplyState?.lastRewardingBlock,
        currentBlockNumber,
      });

      if (isDistributingSupplyRewards && rewardTokenSupplySpeeds.gt(0)) {
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: rewardTokenSupplySpeeds.toString(),
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        supplyDistributions.push(
          formatRewardDistribution({
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: supplyBalanceDollars,
          }),
        );
      }

      const isDistributingBorrowRewards = isDistributingRewards({
        isTimeBased: isChainTimeBased,
        lastRewardingTimestamp: rewardTokenBorrowStateTimeBased?.lastRewardingTimestamp.toNumber(),
        lastRewardingBlock: rewardTokenBorrowState?.lastRewardingBlock,
        currentBlockNumber,
      });

      if (isDistributingBorrowRewards && rewardTokenBorrowSpeeds.gt(0)) {
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: rewardTokenBorrowSpeeds.toString(),
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        borrowDistributions.push(
          formatRewardDistribution({
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: borrowBalanceDollars,
          }),
        );
      }
    },
  );

  // Add Prime distributions
  if (primeApy && !primeApy.supplyApy.isEqualTo(0)) {
    supplyDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.supplyApy,
      token: underlyingToken,
    });
  }

  if (primeApy && !primeApy.borrowApy.isEqualTo(0)) {
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

export default formatDistributions;
