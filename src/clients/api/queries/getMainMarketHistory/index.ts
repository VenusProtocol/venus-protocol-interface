import { VError } from 'errors';
import { MarketSnapshot, VToken } from 'types';
import { restService } from 'utilities';

export interface GetMarketHistoryResponse {
  asset: string;
  data: MarketSnapshot[];
  updatedAt: string;
}

export interface GetMainMarketHistoryInput {
  vToken: VToken;
  limit?: number;
  type?: string;
}

export type GetMainMarketHistoryOutput = {
  marketSnapshots: MarketSnapshot[];
};

const getMainMarketHistory = async ({
  vToken,
  limit = 30,
  type = '1day',
}: GetMainMarketHistoryInput): Promise<GetMainMarketHistoryOutput> => {
  let endpoint = `/market_history/graph?asset=${vToken.address}&type=${type}&version=v2`;

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
    marketSnapshots: response.data?.data.data || [],
  };
};

export default getMainMarketHistory;
