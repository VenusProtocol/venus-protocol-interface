import { VError } from 'libs/errors';
import type { ChainId, MarketHistoryDataPoint } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

import type { LiquidityHubHistoryPeriod } from '../getLiquidityHubHistory';
import { formatApiSpokeMarketHistory } from './formatApiSpokeMarketHistory';

export interface GetSpokeMarketHistoryInput {
  chainId: ChainId;
  vTokenAddress: Address;
  period: LiquidityHubHistoryPeriod;
}

export interface ApiSpokeMarketHistoryPoint {
  blockNumber: string;
  blockTimestamp: number;
  borrowApyDecimal: number;
  totalBorrowsUsdCents: string;
}

export interface GetSpokeMarketHistoryResponse {
  averageBorrowApyDecimal?: number;
  result?: ApiSpokeMarketHistoryPoint[];
}

export interface GetSpokeMarketHistoryOutput {
  marketSnapshots: MarketHistoryDataPoint[];
}

export const getSpokeMarketHistory = async ({
  chainId,
  vTokenAddress,
  period,
}: GetSpokeMarketHistoryInput): Promise<GetSpokeMarketHistoryOutput> => {
  const response = await restService<GetSpokeMarketHistoryResponse>({
    endpoint: `/spoke/markets/${vTokenAddress}/history`,
    method: 'GET',
    params: {
      chainId,
      range: period,
    },
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

  return {
    marketSnapshots: formatApiSpokeMarketHistory(payload),
  };
};
