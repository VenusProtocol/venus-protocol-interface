import moment from 'moment';

export const FORMAT_STRING = 'lll';

export const formatTimeInSeconds = (sec: $TSFixMe) => {
  if (!sec) {
    return '-';
  }
  return `${moment(sec * 1000).format(FORMAT_STRING)}`;
};

export const getRemainingTime = (item: $TSFixMe) => {
  if (item.state === 'Active') {
    const diffBlock = item.endBlock - item.blockNumber;
    const duration = moment.duration(diffBlock < 0 ? 0 : diffBlock * 3, 'seconds');
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) - days * 24;
    const minutes = Math.floor(duration.asMinutes()) - days * 24 * 60 - hours * 60;

    return `${days > 0 ? `${days} ${days > 1 ? 'days' : 'day'},` : ''} ${hours} ${
      hours > 1 ? 'hrs' : 'hr'
    } ${days === 0 ? `, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}` : ''} left`;
  }
  if (item.state === 'Pending') {
    return formatTimeInSeconds(item.createdTimestamp);
  }
  if (item.state === 'Active') {
    return formatTimeInSeconds(item.startTimestamp);
  }
  if (item.state === 'Canceled' || item.state === 'Defeated') {
    return formatTimeInSeconds(item.endTimestamp);
  }
  if (item.state === 'Queued') {
    return formatTimeInSeconds(item.queuedTimestamp);
  }
  if (item.state === 'Expired' || item.state === 'Executed') {
    return formatTimeInSeconds(item.executedTimestamp);
  }
  return `${moment(item.updatedAt).format(FORMAT_STRING)}`;
};
