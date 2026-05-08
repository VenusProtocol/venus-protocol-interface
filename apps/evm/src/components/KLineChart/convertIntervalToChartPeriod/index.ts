import type { Period, PeriodType } from 'klinecharts';

import type { ApiOhlcInterval } from 'types';

const unitMap: Partial<Record<string, PeriodType>> = {
  m: 'minute',
  h: 'hour',
  d: 'day',
};

export const convertIntervalToChartPeriod = (interval: ApiOhlcInterval) => {
  const [, amount, unit] = interval.match(/^(\d+)([a-zA-Z]+)$/) ?? [];

  const period: Period = {
    span: Number(amount),
    type: unitMap[unit] ?? 'hour',
  };

  return period;
};
