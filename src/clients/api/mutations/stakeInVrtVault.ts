import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VrtVault } from 'types/contracts';

export interface IStakeInVrtVaultInput {
  vrtVaultContract: VrtVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type StakeInVrtVaultOutput = TransactionReceipt;

const stakeInVrtVault = async ({
  vrtVaultContract,
  fromAccountAddress,
  amountWei,
}: IStakeInVrtVaultInput): Promise<StakeInVrtVaultOutput> =>
  vrtVaultContract.methods.deposit(amountWei.toFixed()).send({ from: fromAccountAddress });

export default stakeInVrtVault;
