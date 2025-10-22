import type BigNumber from 'bignumber.js';

import type {
  IntrinsicApyDistribution,
  MerklDistribution,
  OffChainApyDistribution,
  RewardDistributorDistribution,
  Token,
  TokenDistribution,
} from 'types';
import { calculateYearlyPercentageRate } from 'utilities';
import type { Address } from 'viem';

interface MerklRewardDetails {
  appName: string;
  merklCampaignIdentifier: string;
  description: string;
  claimUrl: string;
  tags: string[];
}

interface IntrinsicApyRewardDetails {
  name: string;
  description: string;
}

type ApiRewardType = 'venus' | 'merkl' | 'intrinsic' | 'off-chain';

type FormatDistributionInput<TType extends ApiRewardType> = {
  rewardType: TType;
  isActive: boolean;
  marketAddress: Address;
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
  rewardDetails: TType extends 'merkl' ? MerklRewardDetails : IntrinsicApyRewardDetails | null;
};

const formatRewardDistribution = <TType extends ApiRewardType>({
  marketAddress,
  isActive,
  rewardType,
  rewardToken,
  rewardTokenPriceDollars,
  dailyDistributedRewardTokens,
  balanceDollars,
  rewardDetails,
}: FormatDistributionInput<TType>): TokenDistribution => {
  // Convert distribution to dollars
  const dailyDistributedDollars =
    dailyDistributedRewardTokens.multipliedBy(rewardTokenPriceDollars);

  // Calculate APY
  const apyPercentage = calculateYearlyPercentageRate({
    dailyPercentageRate: dailyDistributedDollars.div(
      // Set default balance of 1 to prevent division by 0 when balance is 0
      balanceDollars.isEqualTo(0) ? 1 : balanceDollars,
    ),
  });

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

  if (rewardType === 'intrinsic' && rewardDetails) {
    const distribution: IntrinsicApyDistribution = {
      ...baseProps,
      type: 'intrinsic',
      isActive,
      rewardDetails: rewardDetails as IntrinsicApyRewardDetails,
    };

    return distribution;
  }

  if (rewardType === 'off-chain') {
    const distribution: OffChainApyDistribution = {
      ...baseProps,
      type: 'off-chain',
      isActive,
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

export default formatRewardDistribution;
