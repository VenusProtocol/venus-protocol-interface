import { VError } from 'libs/errors';
import { restService } from 'utilities';
import { type TvlResponseData, formatTvlData } from './utils';

export async function fetchMarketsTvl() {
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
