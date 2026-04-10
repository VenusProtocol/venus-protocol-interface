import type { ApiOhlcInterval } from 'types';

export interface ChartPeriod {
  span: number;
  type: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
}

export const INTERVAL: ApiOhlcInterval = '1h';

export const CHART_PERIOD: ChartPeriod = { span: 1, type: 'hour' };
