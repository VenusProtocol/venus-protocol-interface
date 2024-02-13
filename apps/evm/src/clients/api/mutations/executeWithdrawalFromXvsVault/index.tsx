import { ContractTransaction } from 'ethers';
import { XvsVault } from 'libs/contracts';

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
