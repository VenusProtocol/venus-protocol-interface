import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeRewardTokenAmount {
  rewardTokenAddress: Address;
  pendingCents: string;
  pendingAmountMantissa: string;
}

export interface PrimeRewardsLeaderboardEntry {
  userAddress: Address;
  totalPendingCents: string;
  byRewardToken: PrimeRewardTokenAmount[];
}

export interface GetPrimeRewardsLeaderboardInput {
  chainId: ChainId;
  page?: number;
  limit?: number;
  // Reward token address to sort by, or 'total' to sort by the aggregated USD value
  sortBy?: 'total' | Address;
  order?: 'asc' | 'desc';
}

export interface GetPrimeRewardsLeaderboardOutput {
  blockNumber: string | null;
  computedAt: Date | null;
  page: number;
  limit: number;
  total: number;
  entries: PrimeRewardsLeaderboardEntry[];
}

interface PrimeRewardTokenAmountResponse {
  rewardTokenAddress: Address;
  pendingUsdCents: string;
  pendingAmountMantissa: string;
}

interface PrimeRewardsLeaderboardEntryResponse {
  userAddress: Address;
  totalPendingUsdCents: string;
  byRewardToken: PrimeRewardTokenAmountResponse[];
}

interface GetPrimeRewardsLeaderboardResponse {
  blockNumber: string | null;
  computedAt: string | null;
  page: number;
  limit: number;
  total: number;
  result: PrimeRewardsLeaderboardEntryResponse[];
}

export const getPrimeRewardsLeaderboard = async ({
  chainId,
  page,
  limit,
  sortBy,
  order,
}: GetPrimeRewardsLeaderboardInput): Promise<GetPrimeRewardsLeaderboardOutput> => {
  const response = await restService<GetPrimeRewardsLeaderboardResponse>({
    endpoint: '/prime/rewards-leaderboard',
    method: 'GET',
    params: {
      chainId,
      page,
      limit,
      sortBy,
      order,
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return {
    blockNumber: payload.blockNumber,
    computedAt: payload.computedAt ? new Date(payload.computedAt) : null,
    page: payload.page,
    limit: payload.limit,
    total: payload.total,
    entries: payload.result.map(entry => ({
      userAddress: entry.userAddress,
      totalPendingCents: entry.totalPendingUsdCents,
      byRewardToken: entry.byRewardToken.map(token => ({
        rewardTokenAddress: token.rewardTokenAddress,
        pendingCents: token.pendingUsdCents,
        pendingAmountMantissa: token.pendingAmountMantissa,
      })),
    })),
  };
};
