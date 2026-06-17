import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export type PrimeMinimumStakeReason = 'free_slot' | 'last_position' | 'unavailable';

export interface GetPrimeMinimumStakeInput {
  chainId: ChainId;
}

export interface GetPrimeMinimumStakeOutput {
  blockNumber: string | null;
  computedAt: Date | null;
  tokenLimit: number | null;
  totalTokens: number | null;
  mintThresholdMantissa: string | null;
  minimumStakeMantissa: string | null;
  reason: PrimeMinimumStakeReason;
}

interface GetPrimeMinimumStakeResponse {
  blockNumber: string | null;
  computedAt: string | null;
  tokenLimit: number | null;
  totalTokens: number | null;
  mintThresholdMantissa: string | null;
  minimumStakeMantissa: string | null;
  reason: PrimeMinimumStakeReason;
}

export const getPrimeMinimumStake = async ({
  chainId,
}: GetPrimeMinimumStakeInput): Promise<GetPrimeMinimumStakeOutput> => {
  const response = await restService<GetPrimeMinimumStakeResponse>({
    endpoint: '/prime/minimum-stake',
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
    ...payload,
    computedAt: payload.computedAt ? new Date(payload.computedAt) : null,
  };
};
