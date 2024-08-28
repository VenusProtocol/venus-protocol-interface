import type BigNumber from 'bignumber.js';

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
      rewardTokenLastRewardingSupplyBlockOrTimestamp,
      rewardTokenLastRewardingBorrowBlockOrTimestamp,
      rewardTokenSupplySpeeds,
      rewardTokenBorrowSpeeds,
    }) => {
      const rewardToken = findTokenByAddress({
        tokens,
        address: rewardTokenAddress,
      });

      if (!rewardToken) {
        return;
      }

      const rewardTokenPriceDollars = tokenPriceDollarsMapping[rewardToken.address.toLowerCase()];

      if (!rewardTokenPriceDollars) {
        return;
      }

      const isChainTimeBased = !blocksPerDay;

      const isDistributingSupplyRewards = isDistributingRewards({
        isTimeBased: isChainTimeBased,
        lastRewardingTimestamp: isChainTimeBased
          ? rewardTokenLastRewardingSupplyBlockOrTimestamp.toNumber()
          : undefined,
        lastRewardingBlock: !isChainTimeBased
          ? rewardTokenLastRewardingSupplyBlockOrTimestamp.toNumber()
          : undefined,
        currentBlockNumber,
      });

      if (isDistributingSupplyRewards) {
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
        lastRewardingTimestamp: isChainTimeBased
          ? rewardTokenLastRewardingBorrowBlockOrTimestamp.toNumber()
          : undefined,
        lastRewardingBlock: !isChainTimeBased
          ? rewardTokenLastRewardingBorrowBlockOrTimestamp.toNumber()
          : undefined,
        currentBlockNumber,
      });

      if (isDistributingBorrowRewards) {
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

export default formatDistributions;
