import type BigNumber from 'bignumber.js';
import { isBefore } from 'date-fns';
import type { PointDistribution, Token, TokenDistribution } from 'types';
import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';
import findTokenByAddress from 'utilities/findTokenByAddress';
import formatRewardDistribution from './formatRewardDistribution';

import type {
  ApiPointsDistribution,
  ApiRewardDistributor,
  ApiTokenPrice,
} from 'clients/api/queries/useGetPools/getPools/getApiPools';
import { convertPriceMantissaToDollars } from 'utilities';
import type { PrimeApy } from '../../../types';
import { isDistributingRewards } from './isDistributingRewards';

export type FormatDistributionsInput = {
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  tokenPricesMapping: Record<string, ApiTokenPrice[]>;
  apiRewardsDistributors: ApiRewardDistributor[];
  apiPointsDistributions: ApiPointsDistribution[];
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
  tokenPricesMapping,
  apiRewardsDistributors,
  apiPointsDistributions,
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
      marketAddress,
      rewardType,
      rewardTokenAddress,
      isActive,
      lastRewardingSupplyBlockOrTimestamp,
      lastRewardingBorrowBlockOrTimestamp,
      supplySpeed,
      borrowSpeed,
      rewardDetails,
    }) => {
      const rewardToken = findTokenByAddress({
        tokens,
        address: rewardTokenAddress,
      });

      if (!rewardToken) {
        return;
      }

      const tokenPriceMapping = tokenPricesMapping[rewardTokenAddress.toLowerCase()];
      tokenPriceMapping.sort((tp01, tp02) => {
        if (tp01.priceSource === tp02.priceSource) {
          return 0;
        }

        if (tp01.priceSource === 'oracle' || tp02.priceSource === 'coingecko') {
          return -1;
        }

        return 1;
      });

      if (tokenPriceMapping.length === 0) {
        return;
      }

      const correspondingRewardTokenPrice = tokenPriceMapping[0];

      const { priceMantissa } = correspondingRewardTokenPrice;

      const isChainTimeBased = !blocksPerDay;
      const rewardTokenPriceDollars = convertPriceMantissaToDollars({
        priceMantissa,
        decimals: rewardToken.decimals,
      });

      const isTimeBasedOrMerklReward = isChainTimeBased || rewardType === 'merkl';
      const isSupplyReward = Number(supplySpeed) > 0;

      if (isSupplyReward) {
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
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: supplySpeed,
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        supplyTokenDistributions.push(
          formatRewardDistribution({
            isActive: isActive && isDistributingSupplyRewards,
            marketAddress,
            rewardType,
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: supplyBalanceDollars,
            rewardDetails,
          }),
        );
      }

      const isBorrowReward = Number(borrowSpeed) > 0;

      if (isBorrowReward) {
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
        const dailyDistributedRewardTokens = calculateDailyTokenRate({
          rateMantissa: borrowSpeed,
          decimals: rewardToken.decimals,
          blocksPerDay,
        });

        borrowTokenDistributions.push(
          formatRewardDistribution({
            isActive: isActive && isDistributingBorrowRewards,
            marketAddress,
            rewardType,
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens,
            balanceDollars: borrowBalanceDollars,
            rewardDetails,
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
      isActive: true,
    });

    borrowTokenDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.borrowApy,
      token: underlyingToken,
      isActive: true,
    });
  }

  // Add point distributions
  const borrowPointDistributions: PointDistribution[] = [];
  const supplyPointDistributions: PointDistribution[] = [];

  apiPointsDistributions.forEach(
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
