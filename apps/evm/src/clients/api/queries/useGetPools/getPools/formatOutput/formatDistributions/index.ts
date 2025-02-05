import type BigNumber from 'bignumber.js';
import { isBefore } from 'date-fns';
import type { PointDistribution, Token, TokenDistribution } from 'types';
import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';
import findTokenByAddress from 'utilities/findTokenByAddress';
import formatRewardDistribution from './formatRewardDistribution';

import type {
  ApiPointDistribution,
  ApiRewardDistributor,
} from 'clients/api/queries/useGetPools/getPools/getApiPools';
import { convertPriceMantissaToDollars } from 'utilities';
import type { PrimeApy } from '../../../types';
import { isDistributingRewards } from './isDistributingRewards';

export type FormatDistributionsInput = {
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  apiRewardsDistributors: ApiRewardDistributor[];
  apiPointDistributions: ApiPointDistribution[];
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
  apiPointDistributions,
  currentBlockNumber,
  supplyBalanceTokens,
  borrowBalanceTokens,
  underlyingToken,
  primeApy,
}: FormatDistributionsInput) => {
  const supplyTokenDistributions: TokenDistribution[] = [];
  const borrowTokenDistributions: TokenDistribution[] = [];

  const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(underlyingTokenPriceDollars);
  const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(underlyingTokenPriceDollars);

  // Add token distributions
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

      const isTimeBasedOrMerklReward = isChainTimeBased || rewardType === 'merkl';
      const isDistributingSupplyRewards = isDistributingRewards({
        isTimeBasedOrMerklReward,
        lastRewardingTimestamp: isTimeBasedOrMerklReward
          ? +lastRewardingSupplyBlockOrTimestamp
          : undefined,
        lastRewardingBlock: isTimeBasedOrMerklReward
          ? undefined
          : +lastRewardingSupplyBlockOrTimestamp,
        currentBlockNumber,
      });

      if (isDistributingSupplyRewards) {
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: supplySpeed,
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        supplyTokenDistributions.push(
          formatRewardDistribution({
            rewardType,
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: supplyBalanceDollars,
            description: rewardDetails?.description,
            claimUrl: rewardDetails?.claimUrl,
          }),
        );
      }

      const isDistributingBorrowRewards = isDistributingRewards({
        isTimeBasedOrMerklReward,
        lastRewardingTimestamp: isTimeBasedOrMerklReward
          ? +lastRewardingBorrowBlockOrTimestamp
          : undefined,
        lastRewardingBlock: isTimeBasedOrMerklReward
          ? undefined
          : +lastRewardingBorrowBlockOrTimestamp,
        currentBlockNumber,
      });

      if (isDistributingBorrowRewards) {
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: borrowSpeed,
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        borrowTokenDistributions.push(
          formatRewardDistribution({
            rewardType,
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: borrowBalanceDollars,
            description: rewardDetails?.description,
            claimUrl: rewardDetails?.claimUrl,
          }),
        );
      }
    },
  );

  // Add Prime distributions
  if (primeApy) {
    supplyTokenDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.supplyApy,
      token: underlyingToken,
    });

    borrowTokenDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.borrowApy,
      token: underlyingToken,
    });
  }

  // Add point distributions
  const borrowPointDistributions: PointDistribution[] = [];
  const supplyPointDistributions: PointDistribution[] = [];

  apiPointDistributions.forEach(
    ({ startDate, endDate, action, title, description, incentive, logoUrl, extraInfoUrl }) => {
      const p: PointDistribution = {
        title,
        description,
        incentive,
        logoUrl,
        extraInfoUrl,
      };

      const now = new Date();

      // Check if point distribution is active
      if ((startDate && isBefore(now, startDate)) || (endDate && isBefore(endDate, now))) {
        return;
      }

      if (action === 'supply') {
        supplyPointDistributions.push(p);
      } else if (action === 'borrow') {
        borrowPointDistributions.push(p);
      }
    },
  );

  return {
    supplyTokenDistributions,
    borrowTokenDistributions,
    borrowPointDistributions,
    supplyPointDistributions,
  };
};
