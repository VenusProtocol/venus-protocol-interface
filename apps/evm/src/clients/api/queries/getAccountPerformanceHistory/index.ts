import { startOfDay } from 'date-fns/startOfDay';
import { VError } from 'libs/errors';
import { restService } from 'utilities';
import { formatDataPoints } from './formatDataPoints';
import type {
  AccountPerformanceHistoryApiResponse,
  GetAccountPerformanceHistoryInput,
  GetAccountPerformanceHistoryOutput,
} from './types';

export * from './types';

export const getAccountPerformanceHistory = async ({
  chainId,
  accountAddress,
  period,
}: GetAccountPerformanceHistoryInput): Promise<GetAccountPerformanceHistoryOutput> => {
  const nowMs = Date.now();
  const startOfDayMs = startOfDay(new Date(nowMs)).getTime();

  const [performanceHistory, netWorthToday] = await Promise.all([
    restService<AccountPerformanceHistoryApiResponse>({
      endpoint: `/account/${accountAddress}/performance`,
      method: 'GET',
      params: {
        chainId,
        period,
      },
    }),
    restService<AccountPerformanceHistoryApiResponse>({
      endpoint: `/account/${accountAddress}/net-worth`,
      method: 'GET',
      params: {
        chainId,
        timestampsMs: JSON.stringify([startOfDayMs, 'now']),
      },
    }),
  ]);

  if (performanceHistory.data && 'error' in performanceHistory.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: performanceHistory.data.error },
    });
  }

  if (netWorthToday.data && 'error' in netWorthToday.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: netWorthToday.data.error },
    });
  }

  if (!performanceHistory.data || !netWorthToday.data) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const formattedPerformanceHistory = formatDataPoints({
    dataPoints: performanceHistory.data.performanceDataPoints,
  });

  const netWorthDataPoints = formatDataPoints({
    dataPoints: netWorthToday.data.performanceDataPoints,
  });

  // The endpoint is asked for the start of the day and for now, but it drops either point when it
  // cannot read that part of the history. Matching on the timestamp rather than on the position
  // keeps a lone "now" point from being read as the start of the day.
  const isStartOfDayDataPoint = ({ blockTimestampMs }: (typeof netWorthDataPoints)[number]) =>
    Math.abs(blockTimestampMs - startOfDayMs) < Math.abs(blockTimestampMs - nowMs);

  const startOfDayDataPoint = netWorthDataPoints.find(isStartOfDayDataPoint);
  const currentDataPoint = netWorthDataPoints.find(dataPoint => !isStartOfDayDataPoint(dataPoint));

  return {
    performanceHistory: currentDataPoint
      ? [...formattedPerformanceHistory, currentDataPoint]
      : formattedPerformanceHistory,
    startOfDayNetWorthCents: startOfDayDataPoint?.netWorthCents,
  };
};
