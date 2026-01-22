import { VError } from 'libs/errors';
import { restService } from 'utilities';

export type ApiMarketsTvl = {
  suppliedSumCents: string;
  borrowedSumCents: string;
  liquiditySumCents: string;
  marketCount: number;
  poolCount: number;
  chainCount: number;
};

export async function getMarketsTvl() {
  const response = await restService<ApiMarketsTvl>({
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

  return payload;
}
