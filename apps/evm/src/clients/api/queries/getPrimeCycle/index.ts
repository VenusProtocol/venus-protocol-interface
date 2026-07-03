import { VError } from 'libs/errors';
import type { ChainId, PrimeCycle, PrimeCycleStatus } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimeCycleMarket {
  marketAddress: Address;
  rewardTokenAddress: Address;
  tokenDistributionSpeedMantissa: string;
  supplyMultiplierMantissa: string;
  borrowMultiplierMantissa: string;
  totalRewardMantissa: string;
  totalRewardCents: string;
}

export interface PrimeCycleRankingEntry {
  userAddress: Address;
  finalRank: number;
  finalEffectiveStakeMantissa: string;
  finalTotalStakedMantissa: string;
}

export interface GetPrimeCycleInput {
  chainId: ChainId;
  cycleIndex: number | 'latest';
}

export interface GetPrimeCycleOutput {
  cycle: PrimeCycle | undefined;
  markets: PrimeCycleMarket[];
  ranking: PrimeCycleRankingEntry[];
}

interface PrimeCycleResponse {
  cycleIndex: number;
  status: PrimeCycleStatus;
  startsAt: string;
  endsAt: string;
  mintLimitUsed: number;
  totalRewardPoolUsdCents: string | null;
  finalizedAt: string | null;
}

interface PrimeCycleMarketResponse {
  marketAddress: Address;
  rewardTokenAddress: Address;
  tokenDistributionSpeedMantissa: string;
  supplyMultiplierMantissa: string;
  borrowMultiplierMantissa: string;
  totalRewardMantissa: string;
  totalRewardUsdCents: string;
}

interface GetPrimeCycleResponse {
  cycle: PrimeCycleResponse | null;
  markets: PrimeCycleMarketResponse[];
  ranking: PrimeCycleRankingEntry[];
}

const formatCycle = (cycle: PrimeCycleResponse | null): PrimeCycle | undefined => {
  if (!cycle) {
    return undefined;
  }

  const { totalRewardPoolUsdCents, startsAt, endsAt, finalizedAt, ...rest } = cycle;

  return {
    ...rest,
    totalRewardPoolCents: totalRewardPoolUsdCents ?? undefined,
    startsAt: new Date(startsAt),
    endsAt: new Date(endsAt),
    finalizedAt: finalizedAt ? new Date(finalizedAt) : undefined,
  };
};

export const getPrimeCycle = async ({
  chainId,
  cycleIndex,
}: GetPrimeCycleInput): Promise<GetPrimeCycleOutput> => {
  const response = await restService<GetPrimeCycleResponse>({
    endpoint: `/prime/cycles/${cycleIndex}`,
    method: 'GET',
    params: { chainId },
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
    cycle: formatCycle(payload.cycle),
    markets: payload.markets.map(({ totalRewardUsdCents, ...market }) => ({
      ...market,
      totalRewardCents: totalRewardUsdCents,
    })),
    ranking: payload.ranking,
  };
};
