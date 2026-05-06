import { type Locale, formatDistanceStrict } from 'date-fns';

const ONE_MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

export const formatWaitingPeriod = ({
  waitingPeriodSeconds,
  locale,
}: { waitingPeriodSeconds: number; locale: Locale }) =>
  formatDistanceStrict(new Date(), new Date().getTime() + waitingPeriodSeconds * 1000, {
    unit: waitingPeriodSeconds >= ONE_MONTH_IN_SECONDS ? 'day' : undefined,
    locale,
  });
