import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { checkForXvsVaultProxyTransactionError } from 'errors';
import { XvsVault } from 'types/contracts';

export interface IStakeInXvsVaultInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  amountWei: BigNumber;
  poolIndex: number;
}

export type StakeInXvsVaultOutput = TransactionReceipt;

const stakeInXvsVault = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  amountWei,
  poolIndex,
}: IStakeInXvsVaultInput): Promise<StakeInXvsVaultOutput> => {
  const resp = await xvsVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForXvsVaultProxyTransactionError(resp);
};

export default stakeInXvsVault;
