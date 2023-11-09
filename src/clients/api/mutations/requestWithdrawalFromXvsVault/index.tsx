import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { XvsVault } from 'packages/contracts';

export interface RequestWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  amountWei: BigNumber;
}

export type RequestWithdrawalFromXvsVaultOutput = ContractTransaction;

const requestWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  amountWei,
}: RequestWithdrawalFromXvsVaultInput): Promise<RequestWithdrawalFromXvsVaultOutput> =>
  xvsVaultContract.requestWithdrawal(rewardTokenAddress, poolIndex, amountWei.toFixed());

export default requestWithdrawalFromXvsVault;
