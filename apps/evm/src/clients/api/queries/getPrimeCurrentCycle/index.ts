import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export interface PrimeCurrentCycle {
  cycleIndex: number;
  status: string;
  startsAt: Date;
  endsAt: Date;
  anchorBlockNum: string | null;
  mintLimitUsed: number;
}

export interface PrimePendingRewardPool {
  blockNumber: string;
  computedAt: Date;
  primeHolderCount: number;
  totalPendingUsdCents: string;
}

export interface GetPrimeCurrentCycleInput {
  chainId: ChainId;
}

export interface GetPrimeCurrentCycleOutput {
  cycle: PrimeCurrentCycle | null;
  pendingPool: PrimePendingRewardPool | null;
}

interface PrimeCurrentCycleResponse {
  cycleIndex: number;
  status: string;
  startsAt: string;
  endsAt: string;
  anchorBlockNum: string | null;
  mintLimitUsed: number;
}

interface PrimePendingRewardPoolResponse {
  blockNumber: string;
  computedAt: string;
  primeHolderCount: number;
  totalPendingUsdCents: string;
}

interface GetPrimeCurrentCycleResponse {
  cycle: PrimeCurrentCycleResponse | null;
  pendingPool: PrimePendingRewardPoolResponse | null;
}

export const getPrimeCurrentCycle = async ({
  chainId,
}: GetPrimeCurrentCycleInput): Promise<GetPrimeCurrentCycleOutput> => {
  const response = await restService<GetPrimeCurrentCycleResponse>({
    endpoint: '/prime/cycle/current',
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
    cycle: payload.cycle
      ? {
          ...payload.cycle,
          startsAt: new Date(payload.cycle.startsAt),
          endsAt: new Date(payload.cycle.endsAt),
        }
      : null,
    pendingPool: payload.pendingPool
      ? {
          ...payload.pendingPool,
          computedAt: new Date(payload.pendingPool.computedAt),
        }
      : null,
  };
};
