import type { AccountPerformanceHistoryDataPoint } from '../types';

// The net worth endpoint is asked for the start of the day and for now, but it drops either point
// when it cannot read that part of the history. Matching on the timestamp rather than on the
// position keeps a lone "now" point from being read as the start of the day.
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
