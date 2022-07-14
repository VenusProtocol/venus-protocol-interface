import formatToLockedDeposit from './formatToLockedDeposit';
import { GetXvsVaultLockedDepositsInput, GetXvsVaultLockedDepositsOutput } from './types';

export * from './types';

const getXvsVaultLockedDeposits = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultLockedDepositsInput): Promise<GetXvsVaultLockedDepositsOutput> => {
  const res = await xvsVaultContract.methods
    .getWithdrawalRequests(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return res.map(formatToLockedDeposit);
};

export default getXvsVaultLockedDeposits;
