import type BigNumber from 'bignumber.js';

import type { Token } from 'types';

import type {
  ExternalPendingReward,
  ExternalPendingRewardGroup,
  PendingExternalRewardSummary,
} from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToExternalPendingRewardGroup({
  externalRewardsSummaries,
  tokenPriceMapping,
  tokens,
}: {
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
  externalRewardsSummaries: PendingExternalRewardSummary[];
}) {
  const pendingRewardPerCampaign = externalRewardsSummaries.reduce<{
    [campaignName: string]: ExternalPendingRewardGroup;
  }>((acc, rewardSummary) => {
    const formattedReward = formatRewardSummaryData({
      rewardSummary,
      tokenPriceMapping,
      tokens,
    });

    if (!formattedReward) {
      return acc;
    }

    const formattedExternalReward: ExternalPendingReward = {
      ...formattedReward,
      campaignName: rewardSummary.campaignName,
      appName: rewardSummary.appName,
      claimUrl: rewardSummary.claimUrl,
    };

    const { appName, campaignName, claimUrl } = rewardSummary;
    let campaign = acc[campaignName] || {
      type: 'external',
      appName,
      campaignName,
      claimUrl,
      pendingRewards: [],
    };
    campaign = {
      ...campaign,
      pendingRewards: [...campaign.pendingRewards, formattedExternalReward],
    };
    return {
      ...acc,
      [campaignName]: campaign,
    };
  }, {});
  return Object.values(pendingRewardPerCampaign);
}

export default formatToExternalPendingRewardGroup;
