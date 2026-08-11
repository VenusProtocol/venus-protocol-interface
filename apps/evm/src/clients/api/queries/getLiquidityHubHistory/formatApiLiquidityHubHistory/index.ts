import type { LiquidityHubSnapshot } from 'types';

import type { GetLiquidityHubHistoryResponse } from '..';

export const formatApiLiquidityHubHistory = (
  payload: GetLiquidityHubHistoryResponse,
): LiquidityHubSnapshot[] =>
  (payload.result ?? []).map(snapshot => ({
    blockNumber: Number(snapshot.blockNumber),
    blockTimestamp: Number(snapshot.blockTimestamp) * 1000,
    supplyApyPercentage: Number(snapshot.supplyApy),
    totalSupplyCents: Number(snapshot.totalSupplyCents ?? 0),
    pricePerShare: Number(snapshot.pricePerShare),
  }));
