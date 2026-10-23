import type { MarketHistoryDataPoint } from 'types';

import type { GetSpokeMarketHistoryResponse } from '..';

export const formatApiSpokeMarketHistory = (
  payload: GetSpokeMarketHistoryResponse,
): MarketHistoryDataPoint[] =>
  (payload.result ?? []).map(point => ({
    blockTimestamp: point.blockTimestamp * 1000,
    borrowApyPercentage: point.borrowApyDecimal * 100,
    totalBorrowCents: Number(point.totalBorrowsUsdCents),
  }));
