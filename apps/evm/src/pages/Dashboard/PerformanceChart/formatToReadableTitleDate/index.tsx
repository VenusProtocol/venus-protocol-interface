import { formatDate } from 'date-fns';

export const formatToReadableTitleDate = ({ timestampMs }: { timestampMs: number }) =>
  formatDate(new Date(timestampMs), 'MMMM d, y');
