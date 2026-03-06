import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export interface ApiTopMarket {
  marketAddress: string;
  chainId: string;
}

export interface GetTopMarketsInput {
  chainId: ChainId;
}

export interface GetTopMarketsResponse {
  limit: number;
  page: number;
  total: number;
  result: ApiTopMarket[];
}

export async function getTopMarkets({ chainId }: GetTopMarketsInput) {
  const response = await restService<GetTopMarketsResponse>({
    endpoint: '/top-markets',
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

  return payload;
}
