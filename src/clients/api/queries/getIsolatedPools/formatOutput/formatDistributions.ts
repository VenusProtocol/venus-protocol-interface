import BigNumber from 'bignumber.js';
import { AssetDistribution, Token } from 'types';

import { logError } from 'context/ErrorLogger';
import findTokenByAddress from 'utilities/findTokenByAddress';
import formatDistribution from 'utilities/formatDistribution';
import multiplyMantissaDaily from 'utilities/multiplyMantissaDaily';

import { RewardsDistributorSettingsResult } from '../getRewardsDistributorSettingsMapping';
import { GetTokenPriceDollarsMappingOutput } from '../getTokenPriceDollarsMapping';

export interface FormatDistributionsInput {
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  tokenPriceDollarsMapping: GetTokenPriceDollarsMappingOutput;
  rewardsDistributorSettings: RewardsDistributorSettingsResult[];
  currentBlockNumber: number;
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
}

const formatDistributions = ({
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

      // Filter out passed supply distributions
      if (
        rewardTokenSupplyState.lastRewardingBlock === 0 ||
        currentBlockNumber <= rewardTokenSupplyState.lastRewardingBlock
      ) {
        const supplyDailyDistributedRewardTokens = multiplyMantissaDaily({
          mantissa: rewardTokenSupplySpeeds.toString(),
          decimals: rewardToken.decimals,
        });

        supplyDistributions.push(
          formatDistribution({
            type: 'rewardDistributor',
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens: supplyDailyDistributedRewardTokens,
            balanceDollars: supplyBalanceDollars,
          }),
        );
      }

      // Filter out passed borrow distributions
      if (
        rewardTokenBorrowState.lastRewardingBlock === 0 ||
        currentBlockNumber <= rewardTokenBorrowState.lastRewardingBlock
      ) {
        const borrowDailyDistributedRewardTokens = multiplyMantissaDaily({
          mantissa: rewardTokenBorrowSpeeds.toString(),
          decimals: rewardToken.decimals,
        });

        borrowDistributions.push(
          formatDistribution({
            type: 'rewardDistributor',
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
