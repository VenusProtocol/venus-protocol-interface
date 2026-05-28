import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export async function fetchRiskDashboard<T extends object>({
  endpoint,
  chainId,
  params,
}: {
  endpoint: string;
  chainId: ChainId;
  params?: Record<string, unknown>;
}) {
  const response = await restService<T>({
    endpoint,
    method: 'GET',
    params: { chainId, ...params },
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

  return payload;
}
