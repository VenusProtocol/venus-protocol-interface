import formatDate from 'date-fns/format';

const READABLE_DATE_FORMAT = 'MM.dd';

const formatToReadableDate = (timestamp: Date) => formatDate(timestamp, READABLE_DATE_FORMAT);
export default formatToReadableDate;
