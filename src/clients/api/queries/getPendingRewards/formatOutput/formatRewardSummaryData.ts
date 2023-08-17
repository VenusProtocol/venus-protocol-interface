import BigNumber from 'bignumber.js';
import { Token } from 'types';
import {
  convertDollarsToCents,
  convertWeiToTokens,
  formatTokenPrices,
  getTokenByAddress,
} from 'utilities';

type FormatRewardSummaryDataOutput =
  | {
      rewardToken: Token;
      rewardAmountWei: BigNumber;
      rewardAmountCents: BigNumber | undefined;
      vTokenAddressesWithPendingReward: string[];
      rewardsDistributorAddress: string;
    }
  | undefined;

export type RewardSummary = [
  string, // Rewards distributor address
  string, // Reward token address
  { hex: string }, // Total pending reward
  [
    string, // vToken address
    { hex: string }, // Pending reward
  ][],
];

function formatRewardSummaryData({
  rewardSummary,
  rewardTokenPrices,
}: {
  rewardSummary: RewardSummary;
  rewardTokenPrices: ReturnType<typeof formatTokenPrices>;
}): FormatRewardSummaryDataOutput {
  const rewardToken = getTokenByAddress(rewardSummary[1]);

  // Filter out result if no corresponding token is found
  if (!rewardToken) {
    return;
  }

  const vTokenAddressesWithPendingReward: string[] = [];
  const distributedRewardsWei = new BigNumber(rewardSummary[2].hex);

  // Go through markets to aggregate rewards
  const rewardAmountWei = rewardSummary[3].reduce((acc, market) => {
    const vTokenPendingReward = new BigNumber(market[1].hex);
    // Filter out vToken if it doesn't have any pending reward to collect
    if (vTokenPendingReward.isEqualTo(0)) {
      return acc;
    }

    // Add vToken address to the list of addresses that rewards need to be
    // collected from
    vTokenAddressesWithPendingReward.push(market[0]);

    return acc.plus(vTokenPendingReward);
  }, distributedRewardsWei);

  // Return undefined if there's no pending reward
  if (rewardAmountWei.isEqualTo(0)) {
    return;
  }

  const rewardTokenPrice = rewardTokenPrices[rewardToken.address.toLowerCase()];
  const rewardTokenPriceCents = convertDollarsToCents(rewardTokenPrice);

  // return if there is no available reward token price
  if (!rewardTokenPrice) {
    return undefined;
  }

  const rewardAmountTokens = convertWeiToTokens({
    valueWei: rewardAmountWei,
    token: rewardToken,
  });

  const rewardAmountCents = rewardAmountTokens.multipliedBy(rewardTokenPriceCents);

  return {
    rewardToken,
    rewardAmountWei,
    rewardAmountCents,
    vTokenAddressesWithPendingReward,
    rewardsDistributorAddress: rewardSummary[0],
  };
}

export default formatRewardSummaryData;
