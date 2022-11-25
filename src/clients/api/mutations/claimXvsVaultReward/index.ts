import { checkForXvsVaultProxyTransactionError } from 'errors';
import { Token } from 'types';
import type { TransactionReceipt } from 'web3-core/types';

import { XvsVault } from 'types/contracts';

export interface ClaimXvsVaultRewardInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardToken: Token;
  poolIndex: number;
}

export type ClaimXvsVaultRewardOutput = TransactionReceipt;

const claimXvsVaultReward = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardToken,
  poolIndex,
}: ClaimXvsVaultRewardInput): Promise<ClaimXvsVaultRewardOutput> => {
  const resp = await xvsVaultContract.methods
    .deposit(rewardToken.address, poolIndex, 0)
    .send({ from: fromAccountAddress });
  return checkForXvsVaultProxyTransactionError(resp);
};

export default claimXvsVaultReward;
