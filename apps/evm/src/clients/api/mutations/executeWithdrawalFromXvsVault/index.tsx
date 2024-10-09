import type { XvsVault } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface ExecuteWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type ExecuteWithdrawalFromXvsVaultOutput = ContractTxData<XvsVault, 'executeWithdrawal'>;

const executeWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
}: ExecuteWithdrawalFromXvsVaultInput): Promise<ExecuteWithdrawalFromXvsVaultOutput> => ({
  contract: xvsVaultContract,
  methodName: 'executeWithdrawal',
  args: [rewardTokenAddress, poolIndex],
});

export default executeWithdrawalFromXvsVault;
