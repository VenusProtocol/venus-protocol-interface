import type { XvsVault } from 'libs/contracts';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

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
  requestGaslessTransaction(xvsVaultContract, 'executeWithdrawal', [rewardTokenAddress, poolIndex]);

export default executeWithdrawalFromXvsVault;
