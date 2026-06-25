import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeLeaderboardEntry {
  userAddress: Address;
  rank: number;
  effectiveStakeMantissa: string;
  totalStakedMantissa: string;
  isPrimeHolder: boolean;
}

export interface GetPrimeLeaderboardInput {
  chainId: ChainId;
  page?: number;
  limit?: number;
  accountAddress?: Address;
  // Sort direction of the prime score (effective stake) ranking
  order?: 'asc' | 'desc';
}

export interface GetPrimeLeaderboardOutput {
  blockNumber: string | null;
  computedAt: Date | null;
  page: number;
  limit: number;
  total: number;
  entries: PrimeLeaderboardEntry[];
}

interface GetPrimeLeaderboardResponse {
  blockNumber: string | null;
  computedAt: string | null;
  page: number;
  limit: number;
  total: number;
  result: PrimeLeaderboardEntry[];
}

export const getPrimeLeaderboard = async ({
  chainId,
  page,
  limit,
  accountAddress,
  order,
}: GetPrimeLeaderboardInput): Promise<GetPrimeLeaderboardOutput> => {
  const response = await restService<GetPrimeLeaderboardResponse>({
    endpoint: '/prime/leaderboard',
    method: 'GET',
    params: {
      chainId,
      page,
      limit,
      address: accountAddress,
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
    entries: payload.result,
  };
};
