import type { ContractTransaction } from 'ethers';

import type { XvsVault } from 'libs/contracts';

export interface ExecuteWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type ExecuteWithdrawalFromXvsVaultOutput = ContractTransaction;

const executeWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
}: ExecuteWithdrawalFromXvsVaultInput): Promise<ExecuteWithdrawalFromXvsVaultOutput> =>
  xvsVaultContract.executeWithdrawal(rewardTokenAddress, poolIndex);

export default executeWithdrawalFromXvsVault;
