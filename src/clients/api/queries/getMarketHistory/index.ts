import { VError } from 'errors';
import { MarketSnapshot, VToken } from 'types';
import { restService } from 'utilities';

export interface GetMarketHistoryResponse {
  limit: number;
  total: number;
  result: MarketSnapshot[];
}

export interface GetMarketHistoryInput {
  vToken: VToken;
  limit?: number;
  type?: string;
}

export type GetMarketHistoryOutput = {
  marketSnapshots: MarketSnapshot[];
};

const getMarketHistory = async ({
  vToken,
  limit = 30,
  type = '1day',
}: GetMarketHistoryInput): Promise<GetMarketHistoryOutput> => {
  let endpoint = `/market_history/graph?asset=${vToken.address}&type=${type}`;
  if (limit) {
    endpoint += `&limit=${limit}`;
  }

  const response = await restService<GetMarketHistoryResponse>({
    endpoint,
    method: 'GET',
  });

  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  return {
    marketSnapshots: response.data?.data.result || [],
  };
};

export default getMarketHistory;
