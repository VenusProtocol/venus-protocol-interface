import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { LockedDeposit } from 'types';

const formatToLockedDeposit = ([amount, lockedUntil]: Awaited<
  ReturnType<ContractTypeByName<'xvsVault'>['getWithdrawalRequests']>
>[number]): LockedDeposit => {
  // lockedUntil is a timestamp expressed in seconds, so we convert it to milliseconds
  const lockedUntilMs = +lockedUntil * 1000;
  const unlockedAt = new Date(lockedUntilMs);

  return {
    amountWei: new BigNumber(amount.toString()),
    unlockedAt,
  };
};

export default formatToLockedDeposit;
