import { restService, getVBepToken } from 'utilities';
import { VTokenId, MarketSnapshot } from 'types';

export interface IGetMarketHistoryResponse {
  limit: number;
  total: number;
  result: MarketSnapshot[];
}

export interface IGetMarketHistoryInput {
  vTokenId: VTokenId;
  limit?: number;
  type?: string;
}

export type GetMarketHistoryOutput = MarketSnapshot[];

const getMarketHistory = async ({
  vTokenId,
  limit = 30,
  type = '1day',
}: IGetMarketHistoryInput): Promise<GetMarketHistoryOutput> => {
  const tokenAddress = getVBepToken(vTokenId).address;

  let endpoint = `/market_history/graph?asset=${tokenAddress}&type=${type}`;
  if (limit) {
    endpoint += `&limit=${limit}`;
  }

  const response = await restService<IGetMarketHistoryResponse>({
    endpoint,
    method: 'GET',
  });

  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }

  return response.data?.data.result || [];
};

export default getMarketHistory;
