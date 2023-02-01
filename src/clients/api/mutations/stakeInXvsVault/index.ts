import BigNumber from 'bignumber.js';
import { checkForXvsVaultTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { XvsVault } from 'types/contracts';

export interface StakeInXvsVaultInput {
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
}: StakeInXvsVaultInput): Promise<StakeInXvsVaultOutput> => {
  const resp = await xvsVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForXvsVaultTransactionError(resp);
};

export default stakeInXvsVault;
