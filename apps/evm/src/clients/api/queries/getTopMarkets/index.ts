import { VError } from 'libs/errors';
import { restService } from 'utilities';
import type { TopMarketItem } from './type';

export type TopMarketsParams = {
  limit?: number;
  page?: number;
  chainId?: string | number;
  order?:
    | 'supplyApyDecimal'
    | 'borrowApyDecimal'
    | 'totalSupplyUnderlyingCents'
    | 'totalBorrowCents';
};

export type TopMarketResponseData = {
  limit: number;
  page: number;
  total: number;
  result: TopMarketItem[];
};

export async function fetchTopMarkets(params?: TopMarketsParams) {
  const response = await restService<TopMarketResponseData>({
    endpoint: '/markets',
    method: 'GET',
    params: { limit: 10, ...(params ?? {}) },
    next: true,
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
