import formatDate from 'date-fns/format';

const READABLE_DATE_FORMAT = 'MM.dd';

const formatToReadableDate = (timestampMs: number) =>
  formatDate(new Date(timestampMs), READABLE_DATE_FORMAT);

export default formatToReadableDate;
