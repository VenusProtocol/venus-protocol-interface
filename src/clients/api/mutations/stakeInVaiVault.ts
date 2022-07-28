import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { VaiVault } from 'types/contracts';

export interface StakeInVaiVaultInput {
  vaiVaultContract: VaiVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type StakeInVaiVaultOutput = TransactionReceipt;

const stakeInVaiVault = async ({
  vaiVaultContract,
  fromAccountAddress,
  amountWei,
}: StakeInVaiVaultInput): Promise<StakeInVaiVaultOutput> => {
  const resp = await vaiVaultContract.methods
    .deposit(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForVaiVaultTransactionError(resp);
};

export default stakeInVaiVault;
