import type { ChainId } from '@venusprotocol/chains';

export type AccountPerformanceHistoryPeriod = 'year' | 'halfyear' | 'month';

export type ApiAccountPerformanceHistoryDataPoint = {
  blockNumber: number;
  blockTimestampMs: number;
  netWorthCents: string;
};

export type AccountPerformanceHistoryDataPoint = {
  blockNumber: number;
  blockTimestampMs: number;
  netWorthCents: number;
};

export interface AccountPerformanceHistoryApiResponse {
  performanceDataPoints: ApiAccountPerformanceHistoryDataPoint[];
}

export interface GetAccountPerformanceHistoryInput {
  accountAddress: string;
  chainId: ChainId;
  period: AccountPerformanceHistoryPeriod;
}

export interface GetAccountPerformanceHistoryOutput {
  performanceHistory: AccountPerformanceHistoryDataPoint[];
  startOfDayNetWorthCents: number;
}
