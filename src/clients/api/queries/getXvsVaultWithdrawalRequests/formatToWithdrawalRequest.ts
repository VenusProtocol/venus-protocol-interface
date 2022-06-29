import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { WithdrawalRequest } from 'types';

const formatToWithdrawalRequest = ([amount, lockedUntil]: Awaited<
  ReturnType<ReturnType<XvsVault['methods']['getWithdrawalRequests']>['call']>
>[number]): WithdrawalRequest => {
  // lockedUntil is a timestamp expressed in seconds, so we convert it to milliseconds
  const lockedUntilMs = +lockedUntil * 1000;
  const unlockedAt = new Date(lockedUntilMs);

  return {
    amountWei: new BigNumber(amount),
    unlockedAt,
  };
};

export default formatToWithdrawalRequest;
