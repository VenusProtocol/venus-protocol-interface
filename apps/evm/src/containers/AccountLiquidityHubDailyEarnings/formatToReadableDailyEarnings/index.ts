import BigNumber from 'bignumber.js';

import type { LiquidityHub } from 'types';
import { calculateDailyInterests, formatCentsToReadableValue } from 'utilities';

export const formatToReadableDailyEarnings = ({
  liquidityHubs,
}: { liquidityHubs: LiquidityHub[] }) => {
  const yearlyEarningsCents = liquidityHubs.reduce(
    (acc, liquidityHub) => acc.plus(liquidityHub.userYearlyEarningsCents || 0),
    new BigNumber(0),
  );
  const dailyEarningsCents = calculateDailyInterests(yearlyEarningsCents);

  return formatCentsToReadableValue({ value: dailyEarningsCents });
};
