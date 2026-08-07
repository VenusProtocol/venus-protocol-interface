import { VError } from 'libs/errors';
import type { MarketSnapshot, VToken } from 'types';
import { restService } from 'utilities';

import { formatApiMarketHistory } from './formatApiMarketHistory';

export type MarketHistoryPeriodType = 'year' | 'halfyear' | 'month';

export interface ApiMarketSnapshot {
  blockNumber: string;
  blockTimestamp: string;
  borrowApy: string;
  supplyApy: string;
  totalBorrowCents: string | null;
  totalSupplyCents: string | null;
}

export interface GetMarketHistoryResponse {
  asset: string;
  result: {
    data: ApiMarketSnapshot[];
  };
  updatedAt: string;
}

export interface GetMarketHistoryInput {
  vToken: VToken;
  period: MarketHistoryPeriodType;
}

export type GetMarketHistoryOutput = {
  marketSnapshots: MarketSnapshot[];
};

export const getMarketHistory = async ({
  vToken,
  period,
}: GetMarketHistoryInput): Promise<GetMarketHistoryOutput> => {
  const endpoint = `/markets/history?asset=${vToken.address}&period=${period}`;

  const response = await restService<GetMarketHistoryResponse>({
    endpoint,
    method: 'GET',
  });

  const payload = response.data;

  // @todo Add specific api error handling
  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  return {
    marketSnapshots: formatApiMarketHistory(payload?.result?.data ?? []),
  };
};
