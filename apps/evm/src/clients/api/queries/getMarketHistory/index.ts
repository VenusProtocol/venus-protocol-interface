import { VError } from 'libs/errors';
import type { MarketSnapshot, VToken } from 'types';
import { restService } from 'utilities';

export type MarketHistoryPeriodType = 'year' | 'halfyear' | 'month';

export interface GetMarketHistoryResponse {
  asset: string;
  result: {
    data: MarketSnapshot[];
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

const getMarketHistory = async ({
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
      data: { message: payload.error },
    });
  }

  const marketSnapshots = payload?.result?.data || [];

  return {
    marketSnapshots,
  };
};

export default getMarketHistory;
