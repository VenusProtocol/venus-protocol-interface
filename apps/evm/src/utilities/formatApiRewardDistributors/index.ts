import type { ApiRewardDistributor, Token, TokenDistribution } from 'types';
import { convertRatioToPercentage } from 'utilities/convertRatioToPercentage';
import findTokenByAddress from 'utilities/findTokenByAddress';
import { formatRewardTokenDistribution } from './formatRewardTokenDistribution';

export interface FormatApiRewardDistributorsInput {
  apiRewardDistributors: ApiRewardDistributor[];
  tokens: Token[];
  blocksPerDay?: number;
  currentBlockNumber?: bigint;
}

export interface FormatApiRewardDistributorsOutput {
  supplyTokenDistributions: TokenDistribution[];
  borrowTokenDistributions: TokenDistribution[];
}

export const formatApiRewardDistributors = ({
  apiRewardDistributors,
  tokens,
  blocksPerDay,
  currentBlockNumber,
}: FormatApiRewardDistributorsInput): FormatApiRewardDistributorsOutput => {
  const supplyTokenDistributions: TokenDistribution[] = [];
  const borrowTokenDistributions: TokenDistribution[] = [];

  for (const {
    marketAddress,
    rewardType,
    rewardTokenAddress,
    isActive,
    lastRewardingSupplyBlockOrTimestamp,
    lastRewardingBorrowBlockOrTimestamp,
    supplySpeed,
    borrowSpeed,
    rewardDetails,
    supplyApyRatio,
    borrowApyRatio,
  } of apiRewardDistributors) {
    const rewardToken = findTokenByAddress({
      tokens,
      address: rewardTokenAddress,
    });

    if (!rewardToken) {
      continue;
    }

    const isChainTimeBased = !blocksPerDay;

    const isTimeBasedOrMerklReward = isChainTimeBased || rewardType === 'merkl';
    const rewardTokenDistributionInput = {
      isActive,
      isTimeBasedOrMerklReward,
      currentBlockNumber,
      blocksPerDay,
      marketAddress,
      rewardType,
      rewardToken,
      rewardDetails,
    };

    const supplyTokenDistribution = formatRewardTokenDistribution({
      ...rewardTokenDistributionInput,
      lastRewardingBlockOrTimestamp: lastRewardingSupplyBlockOrTimestamp,
      rateMantissa: supplySpeed,
      apyPercentage: convertRatioToPercentage(supplyApyRatio),
    });

    if (supplyTokenDistribution) {
      supplyTokenDistributions.push(supplyTokenDistribution);
    }

    const borrowTokenDistribution = formatRewardTokenDistribution({
      ...rewardTokenDistributionInput,
      lastRewardingBlockOrTimestamp: lastRewardingBorrowBlockOrTimestamp,
      rateMantissa: borrowSpeed,
      apyPercentage: convertRatioToPercentage(borrowApyRatio),
    });

    if (borrowTokenDistribution) {
      borrowTokenDistributions.push(borrowTokenDistribution);
    }
  }

  return {
    supplyTokenDistributions,
    borrowTokenDistributions,
  };
};
