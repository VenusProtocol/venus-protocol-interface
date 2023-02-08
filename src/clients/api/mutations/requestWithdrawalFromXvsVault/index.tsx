import BigNumber from 'bignumber.js';
import { checkForXvsVaultTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { XvsVault } from 'types/contracts';

export interface RequestWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  poolIndex: number;
  amountWei: BigNumber;
}

export type RequestWithdrawalFromXvsVaultOutput = TransactionReceipt;

const requestWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
  amountWei,
}: RequestWithdrawalFromXvsVaultInput): Promise<RequestWithdrawalFromXvsVaultOutput> => {
  const res = await xvsVaultContract.methods
    .requestWithdrawal(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });

  return checkForXvsVaultTransactionError(res);
};

export default requestWithdrawalFromXvsVault;
