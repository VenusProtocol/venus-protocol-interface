import type BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export interface RequestWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  amountMantissa: BigNumber;
}

export type RequestWithdrawalFromXvsVaultOutput = ContractTransaction;

const requestWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  amountMantissa,
}: RequestWithdrawalFromXvsVaultInput): Promise<RequestWithdrawalFromXvsVaultOutput> =>
  requestGaslessTransaction(xvsVaultContract, 'requestWithdrawal', [
    rewardTokenAddress,
    poolIndex,
    amountMantissa.toFixed(),
  ]);

export default requestWithdrawalFromXvsVault;
