import { ContractReceipt } from 'ethers';

import { VrtVault } from 'types/contracts';

export interface WithdrawFromVrtVaultInput {
  vrtVaultContract: VrtVault;
}

export type WithdrawFromVrtVaultOutput = ContractReceipt;

const withdrawFromVrtVault = async ({
  vrtVaultContract,
}: WithdrawFromVrtVaultInput): Promise<WithdrawFromVrtVaultOutput> => {
  const transaction = await vrtVaultContract.withdraw();
  return transaction.wait(1);
};

export default withdrawFromVrtVault;
