import type BigNumber from 'bignumber.js';

import type {
  GenericDistribution,
  MerklDistribution,
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

interface GenericDistributionRewardDetails {
  name: string;
  description: string;
}

type ApiRewardType = 'venus' | 'merkl' | 'intrinsic' | 'off-chain' | 'yield-to-maturity';

type FormatDistributionInput<TType extends ApiRewardType> = {
  rewardType: TType;
  isActive: boolean;
  marketAddress: Address;
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
  rewardDetails: TType extends 'merkl'
    ? MerklRewardDetails
    : GenericDistributionRewardDetails | null;
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

export default formatRewardDistribution;
