import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { checkForXvsVaultProxyTransactionError } from 'errors';
import { XvsVault } from 'types/contracts';

export interface IStakeWeiInXvsVaultInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  amountWei: BigNumber;
  poolIndex: number;
}

export type StakeWeiInXvsVaultOutput = TransactionReceipt;

const stakeWeiInXvsVault = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  amountWei,
  poolIndex,
}: IStakeWeiInXvsVaultInput): Promise<StakeWeiInXvsVaultOutput> => {
  const resp = await xvsVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForXvsVaultProxyTransactionError(resp);
};

export default stakeWeiInXvsVault;
