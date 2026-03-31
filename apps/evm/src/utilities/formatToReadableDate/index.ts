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
  t(selectedPeriod === 'year' ? 'apyChart.date.short' : 'apyChart.date.full', {
    date: new Date(timestampMs),
  });
