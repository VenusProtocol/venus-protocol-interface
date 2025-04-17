import BigNumber from 'bignumber.js';
import { NULL_ADDRESS } from 'constants/address';
import type { MerklDistribution, Token } from 'types';
import { areAddressesEqual } from 'utilities';
import type { GetMerklUserRewardsResponse, MerklRewardBreakdown } from '.';
import type { PendingExternalRewardSummary } from '../types';

export const formatMerklRewardsPayload = (
  apiPayload: GetMerklUserRewardsResponse,
  merklCampaigns: Record<string, MerklDistribution[]>,
): PendingExternalRewardSummary[] => {
  const allDistributions = Object.values(merklCampaigns).flat();

  // list all Merkl campaign ids and their corresponding reward token
  const campaignIdRewardTokenMapping = allDistributions.reduce<Record<string, Token>>(
    (acc, d) => ({
      ...acc,
      [d.rewardDetails.merklCampaignIdentifier.toLowerCase()]: d.token,
    }),
    {},
  );

  // from the API response, filter the reward breakdowns from campaigns relevant to Venus
  // it will only contain one entry at most, since we filtered by chainId
  const apiRewards = apiPayload?.[0]?.rewards || [];

  // apiRewards is an array of all the user reward tokens in the given chain
  // these entries are generated from campaigns, and each campaign breakdown tells how much a user can claim/has claimed
  const campaignIdToBreakdownMapping: Record<string, MerklRewardBreakdown> = {};
  apiRewards.forEach(reward => {
    reward.breakdowns.forEach(breakdown => {
      const campaignId = breakdown.campaignId.toLowerCase();
      if (campaignIdRewardTokenMapping[campaignId]) {
        campaignIdToBreakdownMapping[campaignId] = breakdown;
      }
    });
  });

  // for each unique reward token, calculate the total rewards and the pending amounts for each market
  const merklRewardTokenAddresses = new Set(allDistributions.map(d => d.token.address));

  const pendingMerklRewards = [...merklRewardTokenAddresses].reduce<PendingExternalRewardSummary[]>(
    (acc, rewardTokenAddress) => {
      const rewardTokenCampaigns = allDistributions.filter(d =>
        areAddressesEqual(rewardTokenAddress, d.token.address),
      );
      const rewardSummaryForToken = rewardTokenCampaigns.reduce<PendingExternalRewardSummary>(
        (accRewardSummary, { rewardDetails }) => {
          const {
            appName,
            merklCampaignIdentifier: campaignId,
            description,
            claimUrl,
          } = rewardDetails;
          const correspondingRewardToken = campaignIdRewardTokenMapping[campaignId.toLowerCase()];

          const campaignBreakdown = campaignIdToBreakdownMapping[campaignId.toLowerCase()];

          const amountLiberated = campaignBreakdown
            ? new BigNumber(campaignBreakdown.amount)
            : new BigNumber(0);
          // the claimable amount is the difference between "amount" and "claimed" in the breakdown
          // if the API returned no breakdown, there is no reward
          const amountMantissa =
            campaignBreakdown && amountLiberated.gt(0)
              ? amountLiberated.minus(campaignBreakdown.claimed)
              : new BigNumber(0);

          const pendingReward = {
            vTokenAddress: rewardDetails.marketAddress,
            amountMantissa,
          };

          const pendingRewards = accRewardSummary.pendingRewards.concat(pendingReward);

          return {
            ...accRewardSummary,
            campaignId,
            appName,
            campaignName: description,
            claimUrl,
            rewardTokenAddress: correspondingRewardToken.address,
            pendingRewards,
          };
        },
        {
          type: 'external',
          appName: '',
          campaignId: '',
          campaignName: '',
          claimUrl: '',
          rewardTokenAddress: NULL_ADDRESS,
          totalRewards: new BigNumber(0),
          pendingRewards: [],
        },
      );

      return [...acc, rewardSummaryForToken];
    },
    [],
  );

  return pendingMerklRewards;
};
