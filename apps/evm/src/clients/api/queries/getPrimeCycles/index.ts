import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export interface PrimeFinalizedCycle {
  cycleIndex: number;
  startsAt: Date;
  endsAt: Date;
  mintLimitUsed: number;
  totalRewardPoolUsdCents: string | null;
  finalizedAt: Date | null;
}

export interface GetPrimeCyclesInput {
  chainId: ChainId;
  page?: number;
  limit?: number;
}

export interface GetPrimeCyclesOutput {
  page: number;
  limit: number;
  total: number;
  cycles: PrimeFinalizedCycle[];
}

interface PrimeFinalizedCycleResponse {
  cycleIndex: number;
  startsAt: string;
  endsAt: string;
  mintLimitUsed: number;
  totalRewardPoolUsdCents: string | null;
  finalizedAt: string | null;
}

interface GetPrimeCyclesResponse {
  page: number;
  limit: number;
  total: number;
  result: PrimeFinalizedCycleResponse[];
}

export const getPrimeCycles = async ({
  chainId,
  page,
  limit,
}: GetPrimeCyclesInput): Promise<GetPrimeCyclesOutput> => {
  const response = await restService<GetPrimeCyclesResponse>({
    endpoint: '/prime/cycles',
    method: 'GET',
    params: { chainId, page, limit },
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
    page: payload.page,
    limit: payload.limit,
    total: payload.total,
    cycles: payload.result.map(cycle => ({
      ...cycle,
      startsAt: new Date(cycle.startsAt),
      endsAt: new Date(cycle.endsAt),
      finalizedAt: cycle.finalizedAt ? new Date(cycle.finalizedAt) : null,
    })),
  };
};
