import BigNumber from 'bignumber.js';

import { VenusLens } from 'libs/contracts';
import { logError } from 'libs/errors';
import { Token } from 'types';
import { convertDollarsToCents, convertMantissaToTokens } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';

type FormatRewardSummaryDataOutput =
  | {
      rewardToken: Token;
      rewardAmountMantissa: BigNumber;
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
  const distributedRewardsMantissa = new BigNumber(rewardSummary.totalRewards.toString());

  // Go through markets to aggregate rewards
  const rewardAmountMantissa = rewardSummary.pendingRewards.reduce((acc, market) => {
    const vTokenPendingReward = new BigNumber(market.amount.toString());
    // Filter out vToken if it doesn't have any pending reward to collect
    if (vTokenPendingReward.isEqualTo(0)) {
      return acc;
    }

    // Add vToken address to the list of addresses that rewards need to be
    // collected from
    vTokenAddressesWithPendingReward.push(market.vTokenAddress);

    return acc.plus(vTokenPendingReward);
  }, distributedRewardsMantissa);

  // Return undefined if there's no pending reward
  if (rewardAmountMantissa.isEqualTo(0)) {
    return;
  }

  const rewardTokenPriceDollars = tokenPriceMapping[rewardToken.address.toLowerCase()];

  // Return if there is no available reward token price
  if (!rewardTokenPriceDollars) {
    return;
  }

  const rewardTokenPriceCents = convertDollarsToCents(rewardTokenPriceDollars);

  const rewardAmountTokens = convertMantissaToTokens({
    value: rewardAmountMantissa,
    token: rewardToken,
  });

  const rewardAmountCents = rewardAmountTokens.multipliedBy(rewardTokenPriceCents);

  return {
    rewardToken,
    rewardAmountMantissa,
    rewardAmountCents,
    vTokenAddressesWithPendingReward,
    rewardsDistributorAddress: rewardSummary.distributorAddress,
  };
}

export default formatRewardSummaryData;
