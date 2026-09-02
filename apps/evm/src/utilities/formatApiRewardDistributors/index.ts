import BigNumber from 'bignumber.js';
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

    // Collateral-gated Merkl campaigns distribute no supply or borrow speed. Merkl reports a
    // campaign-wide APR instead, which is then refined per user based on their positions
    // Both address lists are required: without the collateral list no user could ever qualify
    const merklRewardDetails = rewardType === 'merkl' ? rewardDetails : undefined;
    const collateralGatedCampaignAprPercentage =
      merklRewardDetails?.eligibleBorrowMarketAddresses?.length &&
      merklRewardDetails.participatingCollateralAddresses?.length
        ? new BigNumber(merklRewardDetails.apr ?? 0)
        : undefined;

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
      isCollateralGatedCampaign: !!collateralGatedCampaignAprPercentage,
      lastRewardingBlockOrTimestamp: lastRewardingBorrowBlockOrTimestamp,
      rateMantissa: borrowSpeed,
      apyPercentage:
        collateralGatedCampaignAprPercentage ?? convertRatioToPercentage(borrowApyRatio),
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
