import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { Token } from 'types';

import { XvsVault } from 'types/contracts';

export interface ClaimXvsVaultRewardInput {
  xvsVaultContract: XvsVault;
  rewardToken: Token;
  poolIndex: number;
}

export type ClaimXvsVaultRewardOutput = ContractReceipt;

const claimXvsVaultReward = async ({
  xvsVaultContract,
  rewardToken,
  poolIndex,
}: ClaimXvsVaultRewardInput): Promise<ClaimXvsVaultRewardOutput> => {
  const transaction = await xvsVaultContract.deposit(rewardToken.address, poolIndex, 0);
  const receipt = await transaction.wait(1);
  return checkForXvsVaultProxyTransactionError(receipt);
};

export default claimXvsVaultReward;
