import { ContractTypeByName } from 'packages/contracts';
import { LockedDeposit } from 'types';

export interface GetXvsVaultLockedDepositsInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultLockedDepositsOutput = {
  lockedDeposits: LockedDeposit[];
};
