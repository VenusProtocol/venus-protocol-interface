import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { XvsVault } from 'packages/contracts';

export interface ExecuteWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type ExecuteWithdrawalFromXvsVaultOutput = ContractReceipt;

const executeWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
}: ExecuteWithdrawalFromXvsVaultInput): Promise<ExecuteWithdrawalFromXvsVaultOutput> => {
  const transaction = await xvsVaultContract.executeWithdrawal(rewardTokenAddress, poolIndex);
  const receipt = await transaction.wait(1);
  return checkForXvsVaultProxyTransactionError(receipt);
};

export default executeWithdrawalFromXvsVault;
