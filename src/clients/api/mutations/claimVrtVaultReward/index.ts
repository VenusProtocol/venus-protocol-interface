import { ContractReceipt } from 'ethers';

import { VrtVault } from 'types/contracts';

export interface ClaimVrtVaultRewardInput {
  vrtVaultContract: VrtVault;
}

export type ClaimVrtVaultRewardOutput = ContractReceipt;

const claimVrtVaultReward = async ({
  vrtVaultContract,
}: ClaimVrtVaultRewardInput): Promise<ClaimVrtVaultRewardOutput> => {
  const transaction = await vrtVaultContract['claim()']();
  return transaction.wait(1);
};

export default claimVrtVaultReward;
