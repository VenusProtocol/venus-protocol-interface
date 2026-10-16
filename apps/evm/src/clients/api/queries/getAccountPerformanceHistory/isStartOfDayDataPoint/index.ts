import type { AccountPerformanceHistoryDataPoint } from '../types';

// Matched by timestamp, because either point can be missing
export const isStartOfDayDataPoint = ({
  dataPoint,
  startOfDayMs,
  nowMs,
}: {
  dataPoint: AccountPerformanceHistoryDataPoint;
  startOfDayMs: number;
  nowMs: number;
}) =>
  Math.abs(dataPoint.blockTimestampMs - startOfDayMs) <
  Math.abs(dataPoint.blockTimestampMs - nowMs);
