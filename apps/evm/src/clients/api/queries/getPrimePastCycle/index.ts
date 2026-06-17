import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimePastCycle {
  cycleIndex: number;
  status: string;
  startsAt: Date;
  endsAt: Date;
  mintLimitUsed: number;
  totalRewardPoolUsdCents: string | null;
  finalizedAt: Date | null;
}

export interface PrimePastCycleMarket {
  marketAddress: Address;
  rewardTokenAddress: Address;
  tokenDistributionSpeedMantissa: string;
  supplyMultiplierMantissa: string;
  borrowMultiplierMantissa: string;
  totalRewardMantissa: string;
  totalRewardUsdCents: string;
}

export interface PrimePastCycleRankingEntry {
  userAddress: Address;
  finalRank: number;
  finalEffectiveStakeMantissa: string;
  finalTotalStakedMantissa: string;
}

export interface GetPrimePastCycleInput {
  chainId: ChainId;
  cycleIndex: number | 'latest';
}

export interface GetPrimePastCycleOutput {
  cycle: PrimePastCycle | null;
  markets: PrimePastCycleMarket[];
  ranking: PrimePastCycleRankingEntry[];
}

interface PrimePastCycleResponse {
  cycleIndex: number;
  status: string;
  startsAt: string;
  endsAt: string;
  mintLimitUsed: number;
  totalRewardPoolUsdCents: string | null;
  finalizedAt: string | null;
}

interface GetPrimePastCycleResponse {
  cycle: PrimePastCycleResponse | null;
  markets: PrimePastCycleMarket[];
  ranking: PrimePastCycleRankingEntry[];
}

const formatCycle = (cycle: PrimePastCycleResponse | null): PrimePastCycle | null => {
  if (!cycle) {
    return null;
  }

  return {
    ...cycle,
    startsAt: new Date(cycle.startsAt),
    endsAt: new Date(cycle.endsAt),
    finalizedAt: cycle.finalizedAt ? new Date(cycle.finalizedAt) : null,
  };
};

export const getPrimePastCycle = async ({
  chainId,
  cycleIndex,
}: GetPrimePastCycleInput): Promise<GetPrimePastCycleOutput> => {
  const response = await restService<GetPrimePastCycleResponse>({
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
    markets: payload.markets,
    ranking: payload.ranking,
  };
};
