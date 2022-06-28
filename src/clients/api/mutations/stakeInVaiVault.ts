import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { checkForVaiVaultTransactionError } from 'errors';
import { VaiVault } from 'types/contracts';

export interface IStakeInVaiVaultInput {
  vaiVaultContract: VaiVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type StakeInVaiVaultOutput = TransactionReceipt;

const stakeInVaiVault = async ({
  vaiVaultContract,
  fromAccountAddress,
  amountWei,
}: IStakeInVaiVaultInput): Promise<StakeInVaiVaultOutput> => {
  const resp = await vaiVaultContract.methods
    .deposit(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForVaiVaultTransactionError(resp);
};

export default stakeInVaiVault;
