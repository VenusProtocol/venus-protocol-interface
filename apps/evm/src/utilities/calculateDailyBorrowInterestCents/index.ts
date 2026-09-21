import BigNumber from 'bignumber.js';

import { DAYS_PER_YEAR } from 'constants/time';
import type { Asset } from 'types';

export interface CalculateDailyBorrowInterestCentsInput {
  assets: Asset[];
}

export const calculateDailyBorrowInterestCents = ({
  assets,
}: CalculateDailyBorrowInterestCentsInput) =>
  assets
    .reduce(
      (acc, asset) =>
        acc.plus(asset.userBorrowBalanceCents.multipliedBy(asset.borrowApyPercentage)),
      new BigNumber(0),
    )
    .div(100)
    .div(DAYS_PER_YEAR);
