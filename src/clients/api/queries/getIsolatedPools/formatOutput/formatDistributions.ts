import BigNumber from 'bignumber.js';
import { logError } from 'errors';
import { AssetDistribution, Token } from 'types';

import findTokenByAddress from 'utilities/findTokenByAddress';
import formatRewardDistribution from 'utilities/formatRewardDistribution';
import multiplyMantissaDaily from 'utilities/multiplyMantissaDaily';

import { RewardsDistributorSettingsResult } from '../getRewardsDistributorSettingsMapping';
import { GetTokenPriceDollarsMappingOutput } from '../getTokenPriceDollarsMapping';

export interface FormatDistributionsInput {
  blocksPerDay: number;
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  tokenPriceDollarsMapping: GetTokenPriceDollarsMappingOutput;
  rewardsDistributorSettings: RewardsDistributorSettingsResult[];
  currentBlockNumber: number;
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
}

const formatDistributions = ({
  blocksPerDay,
  underlyingTokenPriceDollars,
  tokens,
  tokenPriceDollarsMapping,
  rewardsDistributorSettings,
  currentBlockNumber,
  supplyBalanceTokens,
  borrowBalanceTokens,
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
        logError(`Could not fetch price of reward token: ${rewardTokenAddress}`);
        return;
      }

      // Filter out passed and nil supply distributions
      if (
        (rewardTokenSupplyState.lastRewardingBlock === 0 ||
          currentBlockNumber <= rewardTokenSupplyState.lastRewardingBlock) &&
        new BigNumber(rewardTokenSupplySpeeds.toString()).isGreaterThan(0)
      ) {
        const supplyDailyDistributedRewardTokens = multiplyMantissaDaily({
          mantissa: rewardTokenSupplySpeeds.toString(),
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
      if (
        (rewardTokenBorrowState.lastRewardingBlock === 0 ||
          currentBlockNumber <= rewardTokenBorrowState.lastRewardingBlock) &&
        new BigNumber(rewardTokenBorrowSpeeds.toString()).isGreaterThan(0)
      ) {
        const borrowDailyDistributedRewardTokens = multiplyMantissaDaily({
          mantissa: rewardTokenBorrowSpeeds.toString(),
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

  return {
    supplyDistributions,
    borrowDistributions,
  };
};

export default formatDistributions;
