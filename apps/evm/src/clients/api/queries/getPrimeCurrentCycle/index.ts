import { VError } from 'libs/errors';
import type { ChainId, PrimeCycle, PrimeCycleStatus } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

export interface PrimePendingRewardTokenTotal {
  rewardTokenAddress: Address;
  totalCurrentCycleUsdMantissa: string;
}

export interface PrimePendingRewardPool {
  blockNumber: string;
  computedAt: Date;
  primeHolderCount: number;
  totalCurrentCycleUsdMantissa: string;
  currentEstimatedTotalUsdMantissa: string;
  byRewardToken: PrimePendingRewardTokenTotal[];
}

export interface GetPrimeCurrentCycleInput {
  chainId: ChainId;
}

export interface GetPrimeCurrentCycleOutput {
  cycle: PrimeCycle | undefined;
  pendingPool: PrimePendingRewardPool | undefined;
}

interface PrimeCurrentCycleResponse {
  cycleIndex: number;
  status: PrimeCycleStatus;
  startsAt: string;
  endsAt: string;
  anchorBlockNum: string | null;
  mintLimitUsed: number;
}

interface PrimePendingRewardTokenTotalResponse {
  rewardTokenAddress: Address;
  totalPendingMantissa: string;
  totalCurrentCycleMantissa: string;
  totalPendingUsdCents: string;
  totalPendingUsdMantissa: string;
  totalCurrentCycleUsdCents: string;
  totalCurrentCycleUsdMantissa: string;
  estimatedAmountMantissa: string;
  currentEstimatedUsdCents: string;
  currentEstimatedUsdMantissa: string;
  cycleStartEstimatedUsdCents: string;
  cycleStartEstimatedUsdMantissa: string;
}

interface PrimePendingRewardPoolResponse {
  blockNumber: string;
  computedAt: string;
  primeHolderCount: number;
  cycleIndex: number;
  totalPendingUsdCents: string;
  totalPendingUsdMantissa: string;
  totalCurrentCycleUsdCents: string;
  totalCurrentCycleUsdMantissa: string;
  currentEstimatedTotalUsdCents: string;
  currentEstimatedTotalUsdMantissa: string;
  cycleStartEstimatedTotalUsdCents: string;
  cycleStartEstimatedTotalUsdMantissa: string;
  byRewardToken: PrimePendingRewardTokenTotalResponse[];
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
          anchorBlockNum: payload.cycle.anchorBlockNum ?? undefined,
          startsAt: new Date(payload.cycle.startsAt),
          endsAt: new Date(payload.cycle.endsAt),
        }
      : undefined,
    pendingPool: payload.pendingPool
      ? {
          blockNumber: payload.pendingPool.blockNumber,
          computedAt: new Date(payload.pendingPool.computedAt),
          primeHolderCount: payload.pendingPool.primeHolderCount,
          totalCurrentCycleUsdMantissa: payload.pendingPool.totalCurrentCycleUsdMantissa,
          currentEstimatedTotalUsdMantissa: payload.pendingPool.currentEstimatedTotalUsdMantissa,
          byRewardToken: payload.pendingPool.byRewardToken.map(token => ({
            rewardTokenAddress: token.rewardTokenAddress,
            totalCurrentCycleUsdMantissa: token.totalCurrentCycleUsdMantissa,
          })),
        }
      : undefined,
  };
};
