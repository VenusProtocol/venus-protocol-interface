import { checkForXvsVaultProxyTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { XvsVault } from 'types/contracts';

export interface ExecuteWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type ExecuteWithdrawalFromXvsVaultOutput = TransactionReceipt;

const executeWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
}: ExecuteWithdrawalFromXvsVaultInput): Promise<ExecuteWithdrawalFromXvsVaultOutput> => {
  const res = await xvsVaultContract.methods
    .executeWithdrawal(rewardTokenAddress, poolIndex)
    .send({ from: fromAccountAddress });

  return checkForXvsVaultProxyTransactionError(res);
};

export default executeWithdrawalFromXvsVault;
