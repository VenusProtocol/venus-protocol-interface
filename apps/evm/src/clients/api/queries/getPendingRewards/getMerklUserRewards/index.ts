import { VError } from 'libs/errors';
import type { ChainId, MerklDistribution } from 'types';
import { restService } from 'utilities';
import type { PendingExternalRewardSummary } from '../types';
import { formatMerklRewardsPayload } from './formatMerklRewardsResponse';

export const BASE_MERKL_API_URL = 'https://api.merkl.xyz/v4/';

export interface MerklRewardBreakdown {
  reason: string;
  amount: string; // the amount the user can claim plus what was already claimed
  claimed: string; // the amount the user has claimed (less or equal than amount)
  pending: string; // the amount of rewards the user has accumulated but can't be claimed yet
  campaignId: string;
  tokenAddress: string;
}

export type GetMerklUserRewardsResponse = Array<{
  rewards: {
    root: string;
    amount: string;
    recipient: string;
    token: {
      address: string;
      chainId: number;
      symbol: string;
      decimals: number;
    };
    breakdowns: MerklRewardBreakdown[];
  }[];
}>;

export interface GetMerklUserRewardsInput {
  chainId: ChainId;
  accountAddress: string;
  merklCampaigns: Record<string, MerklDistribution[]>;
}

export type GetMerklUserRewardsOutput = PendingExternalRewardSummary[];

export const getMerklUserRewards = async ({
  chainId,
  accountAddress,
  merklCampaigns,
}: GetMerklUserRewardsInput): Promise<GetMerklUserRewardsOutput> => {
  const endpoint = `users/${accountAddress}/rewards`;

  const response = await restService<GetMerklUserRewardsResponse>({
    baseUrl: BASE_MERKL_API_URL,
    endpoint,
    method: 'GET',
    params: {
      chainId,
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: {
        message: payload.error,
      },
    });
  }

  return payload ? formatMerklRewardsPayload(payload, merklCampaigns) : [];
};
