import BigNumber from 'bignumber.js';
import { checkForXvsVaultProxyTransactionError } from 'errors';
import { Token } from 'types';
import type { TransactionReceipt } from 'web3-core/types';

import { XvsVault } from 'types/contracts';

export interface StakeInXvsVaultInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardToken: Token;
  amountWei: BigNumber;
  poolIndex: number;
}

export type StakeInXvsVaultOutput = TransactionReceipt;

const stakeInXvsVault = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardToken,
  amountWei,
  poolIndex,
}: StakeInXvsVaultInput): Promise<StakeInXvsVaultOutput> => {
  const resp = await xvsVaultContract.methods
    .deposit(rewardToken.address, poolIndex, amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForXvsVaultProxyTransactionError(resp);
};

export default stakeInXvsVault;
