import type { MarketHistoryPeriodType } from 'clients/api';
import { format as formatDate } from 'date-fns/format';

const DateFormatPerPeriod: Record<MarketHistoryPeriodType, string> = {
  year: 'MM.dd.yy',
  halfyear: 'MM.dd.yy h:mm a',
  month: 'MM.dd.yy h:mm a',
};

export const formatToReadableDate = (
  timestampMs: number,
  selectedPeriod: MarketHistoryPeriodType = 'year',
) => formatDate(new Date(timestampMs), DateFormatPerPeriod[selectedPeriod]);
