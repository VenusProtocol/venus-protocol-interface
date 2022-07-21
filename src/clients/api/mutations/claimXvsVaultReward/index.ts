import { checkForXvsVaultProxyTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { XvsVault } from 'types/contracts';

export interface ClaimXvsVaultRewardInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type ClaimXvsVaultRewardOutput = TransactionReceipt;

const claimXvsVaultReward = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
}: ClaimXvsVaultRewardInput): Promise<ClaimXvsVaultRewardOutput> => {
  const resp = await xvsVaultContract.methods
    .deposit(rewardTokenAddress, poolIndex, 0)
    .send({ from: fromAccountAddress });
  return checkForXvsVaultProxyTransactionError(resp);
};

export default claimXvsVaultReward;
