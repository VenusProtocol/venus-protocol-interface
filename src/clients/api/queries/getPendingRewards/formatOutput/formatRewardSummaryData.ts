import BigNumber from 'bignumber.js';
import { logError } from 'errors';
import { VenusLens } from 'packages/contracts';
import { Token } from 'types';
import { convertDollarsToCents, convertWeiToTokens } from 'utilities';

import findTokenByAddress from 'utilities/findTokenByAddress';

type FormatRewardSummaryDataOutput =
  | {
      rewardToken: Token;
      rewardAmountWei: BigNumber;
      rewardAmountCents: BigNumber | undefined;
      vTokenAddressesWithPendingReward: string[];
      rewardsDistributorAddress: string;
    }
  | undefined;

function formatRewardSummaryData({
  tokens,
  rewardSummary,
  tokenPriceMapping,
}: {
  tokens: Token[];
  rewardSummary: Awaited<ReturnType<VenusLens['pendingRewards']>>;
  tokenPriceMapping: Record<string, BigNumber>;
}): FormatRewardSummaryDataOutput {
  const rewardToken = findTokenByAddress({
    address: rewardSummary.rewardTokenAddress,
    tokens,
  });

  // Filter out result if no corresponding token is found
  if (!rewardToken) {
    logError(`Record missing for reward token: ${rewardSummary.rewardTokenAddress}`);
    return;
  }

  const vTokenAddressesWithPendingReward: string[] = [];
  const distributedRewardsWei = new BigNumber(rewardSummary.totalRewards.toString());

  // Go through markets to aggregate rewards
  const rewardAmountWei = rewardSummary.pendingRewards.reduce((acc, market) => {
    const vTokenPendingReward = new BigNumber(market.amount.toString());
    // Filter out vToken if it doesn't have any pending reward to collect
    if (vTokenPendingReward.isEqualTo(0)) {
      return acc;
    }

    // Add vToken address to the list of addresses that rewards need to be
    // collected from
    vTokenAddressesWithPendingReward.push(market.vTokenAddress);

    return acc.plus(vTokenPendingReward);
  }, distributedRewardsWei);

  // Return undefined if there's no pending reward
  if (rewardAmountWei.isEqualTo(0)) {
    return;
  }

  const rewardTokenPriceDollars = tokenPriceMapping[rewardToken.address.toLowerCase()];

  // Return if there is no available reward token price
  if (!rewardTokenPriceDollars) {
    logError(`Could not fetch price for token: ${rewardToken.address}`);
    return;
  }

  const rewardTokenPriceCents = convertDollarsToCents(rewardTokenPriceDollars);

  const rewardAmountTokens = convertWeiToTokens({
    value: rewardAmountWei,
    token: rewardToken,
  });

  const rewardAmountCents = rewardAmountTokens.multipliedBy(rewardTokenPriceCents);

  return {
    rewardToken,
    rewardAmountWei,
    rewardAmountCents,
    vTokenAddressesWithPendingReward,
    rewardsDistributorAddress: rewardSummary.distributorAddress,
  };
}

export default formatRewardSummaryData;
