import type { TransactionReceipt } from 'web3-core/types';

import { VrtVault } from 'types/contracts';

export interface WithdrawFromVrtVaultInput {
  vrtVaultContract: VrtVault;
  fromAccountAddress: string;
}

export type WithdrawFromVrtVaultOutput = TransactionReceipt;

const withdrawFromVrtVault = async ({
  vrtVaultContract,
  fromAccountAddress,
}: WithdrawFromVrtVaultInput): Promise<WithdrawFromVrtVaultOutput> =>
  vrtVaultContract.methods.withdraw().send({ from: fromAccountAddress });

export default withdrawFromVrtVault;
