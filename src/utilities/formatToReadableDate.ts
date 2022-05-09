import moment from 'moment';

const READABLE_DATE_FORMAT = 'MM/DD';

const formatToReadableDate = (timestamp: Date) => moment(timestamp).format(READABLE_DATE_FORMAT);
export default formatToReadableDate;
