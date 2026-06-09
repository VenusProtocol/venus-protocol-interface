import type BigNumber from 'bignumber.js';

import { ONE_YEAR_MS } from 'constants/time';

export const getProjectedYieldTokens = ({
  depositTokens,
  stakeAprPercentage,
  lockingPeriodMs,
}: {
  depositTokens: BigNumber;
  stakeAprPercentage: number;
  lockingPeriodMs: number;
}) => depositTokens.times(stakeAprPercentage).div(100).times(lockingPeriodMs).div(ONE_YEAR_MS);
