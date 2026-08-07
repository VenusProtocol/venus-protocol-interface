import type BigNumber from 'bignumber.js';

import type { ApiRewardDistributor, Token, TokenDistribution } from 'types';
import convertPriceMantissaToDollars from 'utilities/convertPriceMantissaToDollars';
import findTokenByAddress from 'utilities/findTokenByAddress';
import { formatRewardTokenDistribution } from './formatRewardTokenDistribution';

export interface FormatApiRewardDistributorsInput {
  apiRewardDistributors: ApiRewardDistributor[];
  tokens: Token[];
  supplyBalanceDollars: BigNumber;
  borrowBalanceDollars: BigNumber;
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
  supplyBalanceDollars,
  borrowBalanceDollars,
  blocksPerDay,
  currentBlockNumber,
}: FormatApiRewardDistributorsInput): FormatApiRewardDistributorsOutput => {
  const supplyTokenDistributions: TokenDistribution[] = [];
  const borrowTokenDistributions: TokenDistribution[] = [];

  for (const {
    marketAddress,
    rewardType,
    rewardTokenAddress,
    priceMantissa,
    isActive,
    lastRewardingSupplyBlockOrTimestamp,
    lastRewardingBorrowBlockOrTimestamp,
    supplySpeed,
    borrowSpeed,
    rewardDetails,
  } of apiRewardDistributors) {
    const rewardToken = findTokenByAddress({
      tokens,
      address: rewardTokenAddress,
    });

    if (!rewardToken) {
      continue;
    }

    const isChainTimeBased = !blocksPerDay;
    const rewardTokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa,
      decimals: rewardToken.decimals,
    });
    const isTimeBasedOrMerklReward = isChainTimeBased || rewardType === 'merkl';
    const rewardTokenDistributionInput = {
      isActive,
      isTimeBasedOrMerklReward,
      currentBlockNumber,
      blocksPerDay,
      marketAddress,
      rewardType,
      rewardToken,
      rewardTokenPriceDollars,
      rewardDetails,
    };

    const supplyTokenDistribution = formatRewardTokenDistribution({
      ...rewardTokenDistributionInput,
      lastRewardingBlockOrTimestamp: lastRewardingSupplyBlockOrTimestamp,
      rateMantissa: supplySpeed,
      balanceDollars: supplyBalanceDollars,
    });

    if (supplyTokenDistribution) {
      supplyTokenDistributions.push(supplyTokenDistribution);
    }

    const borrowTokenDistribution = formatRewardTokenDistribution({
      ...rewardTokenDistributionInput,
      lastRewardingBlockOrTimestamp: lastRewardingBorrowBlockOrTimestamp,
      rateMantissa: borrowSpeed,
      balanceDollars: borrowBalanceDollars,
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
