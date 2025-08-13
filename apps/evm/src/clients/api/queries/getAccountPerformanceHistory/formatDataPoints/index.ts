import type { ApiAccountPerformanceHistoryDataPoint } from '../types';

export const formatDataPoints = ({
  dataPoints,
}: { dataPoints: ApiAccountPerformanceHistoryDataPoint[] }) =>
  dataPoints.map(data => ({
    ...data,
    netWorthCents: Number(data.netWorthCents),
  }));
