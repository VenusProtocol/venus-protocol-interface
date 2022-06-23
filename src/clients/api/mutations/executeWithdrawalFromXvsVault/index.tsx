import type { TransactionReceipt } from 'web3-core/types';

import { checkForXvsVaultProxyTransactionError } from 'errors';
import { XvsVault } from 'types/contracts';

export interface IExecuteWithdrawalFromXvsVaultInput {
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
}: IExecuteWithdrawalFromXvsVaultInput): Promise<ExecuteWithdrawalFromXvsVaultOutput> => {
  const res = await xvsVaultContract.methods
    .executeWithdrawal(rewardTokenAddress, poolIndex)
    .send({ from: fromAccountAddress });

  return checkForXvsVaultProxyTransactionError(res);
};

export default executeWithdrawalFromXvsVault;
