import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { XvsVault } from 'libs/contracts';

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
  xvsVaultContract.requestWithdrawal(rewardTokenAddress, poolIndex, amountMantissa.toFixed());

export default requestWithdrawalFromXvsVault;
