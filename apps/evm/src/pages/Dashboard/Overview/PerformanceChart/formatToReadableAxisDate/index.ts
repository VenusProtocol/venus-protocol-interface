import { format as formatDate } from 'date-fns/format';

export const formatToReadableAxisDate = (timestampMs: string) =>
  formatDate(new Date(timestampMs), 'MM.dd.yy');
