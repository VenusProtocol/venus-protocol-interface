import { VError } from 'libs/errors';
import { restService } from 'utilities';
import type { MarketsResponseData, TvlResponseData } from './types';
import { formatTvlData, mapMarketsData } from './utils';

export async function fetchMarkets() {
  const response = await restService<MarketsResponseData>({
    endpoint: '/markets/core-pool?limit=500',
    method: 'GET',
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

  return mapMarketsData(payload?.result);
}

export async function fetchTvl() {
  const response = await restService<TvlResponseData>({
    endpoint: '/markets/tvl',
    method: 'GET',
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

  return formatTvlData(payload);
}
