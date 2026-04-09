import type { MarketHistoryPeriodType } from 'clients/api';

export interface FormatToReadableDateInput {
  timestampMs: number;
  selectedPeriod?: MarketHistoryPeriodType;
  t: (key: string, options: { date: Date }) => string;
}

export const formatToReadableDate = ({
  timestampMs,
  selectedPeriod,
  t,
}: FormatToReadableDateInput) =>
  selectedPeriod === 'year'
    ? t('apyChart.date.short', {
        date: new Date(timestampMs),
      })
    : t('apyChart.date.full', {
        date: new Date(timestampMs),
      });
