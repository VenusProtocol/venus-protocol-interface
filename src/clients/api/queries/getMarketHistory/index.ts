import { VError } from 'errors';
import { MarketSnapshot, VToken } from 'types';
import { restService } from 'utilities';

const ENTRIES_PER_HOUR = 2;
const ENTRIES_PER_DAY = ENTRIES_PER_HOUR * 24;
const ENTRIES_PER_WEEK = ENTRIES_PER_DAY * 7;
const ENTRIES_PER_30_DAYS = ENTRIES_PER_DAY * 30;
const ENTRIES_PER_YEAR = ENTRIES_PER_DAY * 365;

export type MarketHistoryType = '1 day' | '1 week' | '1 month' | '1 year';

export interface GetMarketHistoryResponse {
  asset: string;
  result: {
    data: MarketSnapshot[];
  };
  updatedAt: string;
}

export interface GetMarketHistoryInput {
  vToken: VToken;
  type?: MarketHistoryType;
}

export type GetMarketHistoryOutput = {
  marketSnapshots: MarketSnapshot[];
};

const getMarketHistory = async ({
  vToken,
  type = '1 month',
}: GetMarketHistoryInput): Promise<GetMarketHistoryOutput> => {
  const endpoint = `/markets/history?asset=${vToken.address}`;

  const response = await restService<GetMarketHistoryResponse>({
    endpoint,
    method: 'GET',
    next: true,
  });

  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  let sampleSize = response.data?.result.data.length || 0;

  switch (type) {
    case '1 year':
      sampleSize = ENTRIES_PER_YEAR;
      break;
    case '1 month':
      sampleSize = ENTRIES_PER_30_DAYS;
      break;
    case '1 week':
      sampleSize = ENTRIES_PER_WEEK;
      break;
    default:
      sampleSize = ENTRIES_PER_DAY;
      break;
  }

  const marketSnapshots = response.data?.result.data.slice(-sampleSize) || [];

  return {
    marketSnapshots,
  };
};

export default getMarketHistory;
