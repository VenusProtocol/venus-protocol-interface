import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetXvsVaultUserInfoInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultUserInfoOutput {
  stakedAmountWei: BigNumber;
  pendingWithdrawalsTotalAmountWei: BigNumber;
  rewardDebtAmountWei: BigNumber;
}
