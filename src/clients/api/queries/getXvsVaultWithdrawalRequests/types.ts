import { IWithdrawalRequest } from 'types';
import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultWithdrawalRequestsInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultWithdrawalRequestsOutput = IWithdrawalRequest[];
