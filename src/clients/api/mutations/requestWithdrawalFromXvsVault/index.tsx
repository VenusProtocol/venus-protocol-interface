import BigNumber from 'bignumber.js';
import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { XvsVault } from 'types/contracts';

export interface RequestWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  amountWei: BigNumber;
}

export type RequestWithdrawalFromXvsVaultOutput = ContractReceipt;

const requestWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  amountWei,
}: RequestWithdrawalFromXvsVaultInput): Promise<RequestWithdrawalFromXvsVaultOutput> => {
  const transaction = await xvsVaultContract.requestWithdrawal(
    rewardTokenAddress,
    poolIndex,
    amountWei.toFixed(),
  );
  const receipt = await transaction.wait(1);
  return checkForXvsVaultProxyTransactionError(receipt);
};

export default requestWithdrawalFromXvsVault;
