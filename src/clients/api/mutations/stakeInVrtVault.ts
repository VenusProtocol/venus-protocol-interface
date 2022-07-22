import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VrtVault } from 'types/contracts';

export interface StakeInVrtVaultInput {
  vrtVaultContract: VrtVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type StakeInVrtVaultOutput = TransactionReceipt;

const stakeInVrtVault = async ({
  vrtVaultContract,
  fromAccountAddress,
  amountWei,
}: StakeInVrtVaultInput): Promise<StakeInVrtVaultOutput> =>
  vrtVaultContract.methods.deposit(amountWei.toFixed()).send({ from: fromAccountAddress });

export default stakeInVrtVault;
