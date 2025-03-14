import type BigNumber from 'bignumber.js';

import type {
  MerklDistribution,
  RewardDistributorDistribution,
  Token,
  TokenDistribution,
} from 'types';
import { calculateYearlyPercentageRate } from 'utilities';

type FormatDistributionInput<TType extends 'venus' | 'merkl'> = {
  rewardType: TType;
  isActive: boolean;
  marketAddress: string;
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
  rewardDetails: TType extends 'merkl'
    ? {
        appName: string;
        merklCampaignIdentifier: string;
        description: string;
        claimUrl: string;
        tags: string[];
      }
    : null;
};

const formatRewardDistribution = <TType extends 'venus' | 'merkl'>({
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
      rewardDetails: { ...rewardDetails, marketAddress },
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
