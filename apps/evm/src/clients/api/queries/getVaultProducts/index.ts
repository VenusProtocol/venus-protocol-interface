import { VError } from 'libs/errors';
import { restService } from 'utilities';
import type {
  GetVaultProductsInput,
  GetVaultProductsOutput,
  GetVaultProductsResponse,
} from './types';

export const getVaultProducts = async ({
  chainId,
}: GetVaultProductsInput): Promise<GetVaultProductsOutput> => {
  const response = await restService<GetVaultProductsResponse>({
    endpoint: '/fixed-rate-vaults',
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
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return payload.result ?? [];
};
