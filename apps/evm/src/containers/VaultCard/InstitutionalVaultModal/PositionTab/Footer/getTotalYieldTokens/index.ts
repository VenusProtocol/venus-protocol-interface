import type BigNumber from 'bignumber.js';

import { ONE_YEAR_MS } from 'constants/time';

export const getTotalYieldTokens = ({
  depositTokens,
  fixedApyDecimal,
  lockingPeriodMs,
}: {
  depositTokens: BigNumber;
  fixedApyDecimal: string;
  lockingPeriodMs: number;
}) => depositTokens.times(fixedApyDecimal).times(lockingPeriodMs).div(ONE_YEAR_MS);
