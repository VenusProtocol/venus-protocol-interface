import type BigNumber from 'bignumber.js';

import type {
  ApiRewardType,
  GenericDistribution,
  MerklDistribution,
  RewardDistributorDistribution,
  Token,
  TokenDistribution,
} from 'types';
import type { Address } from 'viem';

interface MerklRewardDetails {
  appName: string;
  merklCampaignIdentifier: string;
  description: string;
  claimUrl: string;
  tags: string[];
}

interface GenericDistributionRewardDetails {
  name: string;
  description: string;
}

type FormatDistributionInput<TType extends ApiRewardType> = {
  rewardType: TType;
  isActive: boolean;
  marketAddress: Address;
  rewardToken: Token;
  dailyDistributedRewardTokens: BigNumber;
  apyPercentage: BigNumber;
  rewardDetails: TType extends 'merkl'
    ? MerklRewardDetails
    : GenericDistributionRewardDetails | null;
};

export const formatRewardDistribution = <TType extends ApiRewardType>({
  marketAddress,
  isActive,
  rewardType,
  rewardToken,
  dailyDistributedRewardTokens,
  rewardDetails,
  apyPercentage,
}: FormatDistributionInput<TType>): TokenDistribution => {
  const baseProps = {
    type: rewardType,
    token: rewardToken,
    apyPercentage,
    dailyDistributedTokens: dailyDistributedRewardTokens,
    rewardDetails: rewardType === 'merkl' ? { ...rewardDetails, marketAddress } : undefined,
  };

  if (rewardType === 'merkl' && rewardDetails) {
    const distribution: MerklDistribution = {
      ...baseProps,
      type: 'merkl',
      isActive,
      rewardDetails: { ...(rewardDetails as MerklRewardDetails), marketAddress },
    };

    return distribution;
  }

  if (
    (rewardType === 'intrinsic' ||
      rewardType === 'off-chain' ||
      rewardType === 'yield-to-maturity') &&
    rewardDetails
  ) {
    const distribution: GenericDistribution = {
      ...baseProps,
      type: rewardType,
      isActive,
      rewardDetails: rewardDetails as GenericDistributionRewardDetails,
    };

    return distribution;
  }

  const distribution: RewardDistributorDistribution = {
    ...baseProps,
    isActive,
    type: 'venus',
  };

  return distribution;
};
