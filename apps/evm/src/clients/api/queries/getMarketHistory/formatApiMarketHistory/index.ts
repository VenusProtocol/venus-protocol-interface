import type { MarketSnapshot } from 'types';

import type { ApiMarketSnapshot } from '..';

export const formatApiMarketHistory = (apiMarketSnapshots: ApiMarketSnapshot[]): MarketSnapshot[] =>
  apiMarketSnapshots.map(snapshot => ({
    blockNumber: Number(snapshot.blockNumber),
    blockTimestamp: Number(snapshot.blockTimestamp) * 1000,
    borrowApyPercentage: Number(snapshot.borrowApy),
    supplyApyPercentage: Number(snapshot.supplyApy),
    totalBorrowCents: Number(snapshot.totalBorrowCents ?? 0),
    totalSupplyCents: Number(snapshot.totalSupplyCents ?? 0),
  }));
