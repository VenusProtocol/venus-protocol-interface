import type { MarketHistoryPeriodType } from 'clients/api';
import { format as formatDate } from 'date-fns/format';

const DateFormatPerPeriod: Record<MarketHistoryPeriodType, string> = {
  year: 'MM.dd.yy',
  halfyear: 'MM.dd.yy',
  month: 'MM.dd.yy hh aa',
};

const formatToReadableDate = (
  timestampMs: number,
  selectedPeriod: MarketHistoryPeriodType = 'year',
) => formatDate(new Date(timestampMs), DateFormatPerPeriod[selectedPeriod]);

export default formatToReadableDate;
