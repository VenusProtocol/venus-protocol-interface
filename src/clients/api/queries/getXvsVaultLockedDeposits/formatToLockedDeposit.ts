import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { LockedDeposit } from 'types';

const formatToLockedDeposit = ([amount, lockedUntil]: Awaited<
  ReturnType<ReturnType<XvsVault['methods']['getWithdrawalRequests']>['call']>
>[number]): LockedDeposit => {
  // lockedUntil is a timestamp expressed in seconds, so we convert it to milliseconds
  const lockedUntilMs = +lockedUntil * 1000;
  const unlockedAt = new Date(lockedUntilMs);

  return {
    amountWei: new BigNumber(amount),
    unlockedAt,
  };
};

export default formatToLockedDeposit;
