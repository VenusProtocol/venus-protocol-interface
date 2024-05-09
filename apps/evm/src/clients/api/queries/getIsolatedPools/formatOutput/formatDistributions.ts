import BigNumber from 'bignumber.js';
import { getUnixTime } from 'date-fns';

import { logError } from 'libs/errors';
import type { AssetDistribution, PrimeApy, Token } from 'types';
import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';
import findTokenByAddress from 'utilities/findTokenByAddress';
import formatRewardDistribution from 'utilities/formatRewardDistribution';

import type { RewardsDistributorSettingsResult } from '../getRewardsDistributorSettingsMapping';
import type { GetTokenPriceDollarsMappingOutput } from '../getTokenPriceDollarsMapping';

export type FormatDistributionsInput = {
  underlyingToken: Token;
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  tokenPriceDollarsMapping: GetTokenPriceDollarsMappingOutput;
  rewardsDistributorSettings: RewardsDistributorSettingsResult[];
  currentBlockNumber: number;
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
  isNetworkTimeBased: boolean;
  blocksPerDay?: number;
  primeApy?: PrimeApy;
};

const formatDistributions = ({
  isNetworkTimeBased,
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

  // Convert balances to dollars
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

      // to check if rewards are still being distributed in time based networks,
      // we compare the current date to the lastRewardingTimestamp
      // in a block based network, we compare the current block to the lastRewardingBlock
      const nowTimestamp = getUnixTime(new Date());
      const isDistributingSupplyRewards =
        isNetworkTimeBased && rewardTokenSupplyStateTimeBased
          ? rewardTokenSupplyStateTimeBased.lastRewardingTimestamp.isZero() ||
            new BigNumber(rewardTokenSupplyStateTimeBased.lastRewardingTimestamp.toString()).gte(
              nowTimestamp,
            )
          : rewardTokenSupplyState?.lastRewardingBlock === 0 ||
            (rewardTokenSupplyState &&
              currentBlockNumber <= rewardTokenSupplyState.lastRewardingBlock);
      const areSupplyRewardsSpeedsPositive = new BigNumber(
        rewardTokenSupplySpeeds.toString(),
      ).isGreaterThan(0);
      const isDistributingBorrowRewards =
        isNetworkTimeBased && rewardTokenBorrowStateTimeBased
          ? rewardTokenBorrowStateTimeBased.lastRewardingTimestamp.isZero() ||
            rewardTokenBorrowStateTimeBased.lastRewardingTimestamp.gte(nowTimestamp)
          : rewardTokenBorrowState?.lastRewardingBlock === 0 ||
            (rewardTokenBorrowState &&
              currentBlockNumber <= rewardTokenBorrowState.lastRewardingBlock);
      const areBorrowRewardsSpeedsPositive = new BigNumber(
        rewardTokenBorrowSpeeds.toString(),
      ).isGreaterThan(0);

      // Filter out passed and nil supply distributions
      if (isDistributingSupplyRewards && areSupplyRewardsSpeedsPositive) {
        const supplyDailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: rewardTokenSupplySpeeds.toString(),
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        supplyDistributions.push(
          formatRewardDistribution({
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens: supplyDailyDistributedRewardTokens,
            balanceDollars: supplyBalanceDollars,
          }),
        );
      }

      // Filter out passed and nil borrow distributions
      if (isDistributingBorrowRewards && areBorrowRewardsSpeedsPositive) {
        const borrowDailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: rewardTokenBorrowSpeeds.toString(),
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        borrowDistributions.push(
          formatRewardDistribution({
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens: borrowDailyDistributedRewardTokens,
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
