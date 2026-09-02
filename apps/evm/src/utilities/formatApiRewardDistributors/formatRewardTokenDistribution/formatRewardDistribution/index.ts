import type BigNumber from 'bignumber.js';

import { logError } from 'libs/errors';
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
  apr?: number;
  participatingCollateralAddresses?: Address[];
  eligibleBorrowMarketAddresses?: Address[];
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
}: FormatDistributionInput<TType>): TokenDistribution | undefined => {
  const baseProps = {
    type: rewardType,
    token: rewardToken,
    apyPercentage,
    dailyDistributedTokens: dailyDistributedRewardTokens,
    rewardDetails: rewardType === 'merkl' ? { ...rewardDetails, marketAddress } : undefined,
  };

  if (rewardType === 'merkl' && rewardDetails) {
    const { apr, ...merklRewardDetails } = rewardDetails as MerklRewardDetails;

    const distribution: MerklDistribution = {
      ...baseProps,
      type: 'merkl',
      isActive,
      rewardDetails: { ...merklRewardDetails, marketAddress, aprPercentage: apr },
    };

    return distribution;
  }

  if (
    (rewardType === 'intrinsic' ||
      rewardType === 'off-chain' ||
      rewardType === 'yield-to-maturity' ||
      rewardType === 'liquidity-hub-intrinsic') &&
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

  if (rewardType === 'venus') {
    const distribution: RewardDistributorDistribution = {
      ...baseProps,
      isActive,
      type: 'venus',
    };

    return distribution;
  }

  logError(
    `Could not format reward distribution of type "${rewardType}" for market ${marketAddress}`,
  );

  return undefined;
};
