import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VrtVault } from 'types/contracts';

export interface IStakeWeiInVrtVaultInput {
  vrtVaultContract: VrtVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type StakeWeiInVrtVaultOutput = TransactionReceipt;

const stakeWeiInVrtVault = async ({
  vrtVaultContract,
  fromAccountAddress,
  amountWei,
}: IStakeWeiInVrtVaultInput): Promise<StakeWeiInVrtVaultOutput> =>
  vrtVaultContract.methods.deposit(amountWei.toFixed()).send({ from: fromAccountAddress });

export default stakeWeiInVrtVault;
