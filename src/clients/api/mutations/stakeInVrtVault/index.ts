import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';

import { VrtVault } from 'types/contracts';

export interface StakeInVrtVaultInput {
  vrtVaultContract: VrtVault;
  amountWei: BigNumber;
}

export type StakeInVrtVaultOutput = ContractReceipt;

const stakeInVrtVault = async ({
  vrtVaultContract,
  amountWei,
}: StakeInVrtVaultInput): Promise<StakeInVrtVaultOutput> => {
  const transaction = await vrtVaultContract.deposit(amountWei.toFixed());
  return transaction.wait(1);
};

export default stakeInVrtVault;
