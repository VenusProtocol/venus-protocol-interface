import formatToLockedDeposit from './formatToLockedDeposit';
import { GetXvsVaultLockedDepositsInput, GetXvsVaultLockedDepositsOutput } from './types';

export * from './types';

const getXvsVaultLockedDeposits = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultLockedDepositsInput): Promise<GetXvsVaultLockedDepositsOutput> => {
  const res = await xvsVaultContract.getWithdrawalRequests(
    rewardTokenAddress,
    poolIndex,
    accountAddress,
  );
  return {
    lockedDeposits: res.map(formatToLockedDeposit),
  };
};

export default getXvsVaultLockedDeposits;
