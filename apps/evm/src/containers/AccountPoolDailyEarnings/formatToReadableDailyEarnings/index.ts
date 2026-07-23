import type { Pool } from 'types';
import { calculateDailyInterests, formatCentsToReadableValue } from 'utilities';

export const formatToReadableDailyEarnings = ({
  yearlyEarningsCents,
}: { yearlyEarningsCents: Pool['userYearlyEarningsCents'] }) => {
  const dailyEarningsCents = yearlyEarningsCents && calculateDailyInterests(yearlyEarningsCents);

  return formatCentsToReadableValue({ value: dailyEarningsCents });
};
