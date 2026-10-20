import { startOfDay } from 'date-fns/startOfDay';
import { VError } from 'libs/errors';
import { restService } from 'utilities';
import { formatDataPoints } from './formatDataPoints';
import { isStartOfDayDataPoint } from './isStartOfDayDataPoint';
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

  const startOfDayDataPoint = netWorthDataPoints.find(dataPoint =>
    isStartOfDayDataPoint({ dataPoint, startOfDayMs, nowMs }),
  );
  const currentDataPoint = netWorthDataPoints.find(
    dataPoint => !isStartOfDayDataPoint({ dataPoint, startOfDayMs, nowMs }),
  );

  return {
    performanceHistory: currentDataPoint
      ? [...formattedPerformanceHistory, currentDataPoint]
      : formattedPerformanceHistory,
    startOfDayNetWorthCents: startOfDayDataPoint?.netWorthCents,
  };
};
