import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { checkForXvsVaultProxyTransactionError } from 'errors';
import { XvsVault } from 'types/contracts';

export interface IRequestWithdrawalFromXvsVaultInput {
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
}: IRequestWithdrawalFromXvsVaultInput): Promise<RequestWithdrawalFromXvsVaultOutput> => {
  const res = await xvsVaultContract.methods
    .requestWithdrawal(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });

  return checkForXvsVaultProxyTransactionError(res);
};

export default requestWithdrawalFromXvsVault;
