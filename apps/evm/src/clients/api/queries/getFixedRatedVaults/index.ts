import { VError } from 'libs/errors';
import { restService } from 'utilities';
import type {
  GetFixedRatedVaultsInput,
  GetFixedRatedVaultsOutput,
  GetFixedRatedVaultsResponse,
} from './types';

export * from './types';

export const getFixedRatedVaults = async ({
  chainId,
  includeExpired = true,
}: GetFixedRatedVaultsInput): Promise<GetFixedRatedVaultsOutput> => {
  const response = await restService<GetFixedRatedVaultsResponse>({
    endpoint: '/fixed-rate-vaults',
    method: 'GET',
    params: {
      chainId,
      includeExpired,
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

  return payload.result ?? [];
};
