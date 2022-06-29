import { WithdrawalRequest } from 'types';
import { XvsVault } from 'types/contracts';

export interface GetXvsVaultWithdrawalRequestsInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultWithdrawalRequestsOutput = WithdrawalRequest[];
