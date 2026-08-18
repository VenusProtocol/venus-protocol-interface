import type { LiquidityHubHistoryPeriod, MarketHistoryPeriodType } from 'clients/api';

export type ChartHistoryPeriod = MarketHistoryPeriodType | LiquidityHubHistoryPeriod;

export interface FormatToReadableDateInput {
  timestampMs: number;
  selectedPeriod?: ChartHistoryPeriod;
  t: (key: string, options: { date: Date }) => string;
}

export const formatToReadableDate = ({
  timestampMs,
  selectedPeriod,
  t,
}: FormatToReadableDateInput) => {
  switch (selectedPeriod) {
    case 'year':
    case '1y':
      return t('apyChart.date.short', {
        date: new Date(timestampMs),
      });
    case 'halfyear':
    case 'month':
    case '1m':
    case '3m':
      return t('apyChart.date.full', {
        date: new Date(timestampMs),
      });
  }

  return t('apyChart.date.full', {
    date: new Date(timestampMs),
  });
};
