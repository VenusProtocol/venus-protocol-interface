import { checkForVaiVaultTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { VaiVault } from 'types/contracts';

export interface ClaimVaiVaultRewardInput {
  vaiVaultContract: VaiVault;
}

export type ClaimVaiVaultRewardOutput = ContractReceipt;

const claimVaiVaultReward = async ({
  vaiVaultContract,
}: ClaimVaiVaultRewardInput): Promise<ClaimVaiVaultRewardOutput> => {
  const transaction = await vaiVaultContract['claim()']();
  const receipt = await transaction.wait(1);
  return checkForVaiVaultTransactionError(receipt);
};

export default claimVaiVaultReward;
