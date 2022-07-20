import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { VaiVault } from 'types/contracts';

export interface WithdrawFromVaiVaultInput {
  vaiVaultContract: VaiVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type WithdrawFromVaiVaultOutput = TransactionReceipt;

const withdrawFromVaiVault = async ({
  vaiVaultContract,
  fromAccountAddress,
  amountWei,
}: WithdrawFromVaiVaultInput): Promise<WithdrawFromVaiVaultOutput> => {
  const res = await vaiVaultContract.methods
    .withdraw(amountWei.toFixed())
    .send({ from: fromAccountAddress });

  return checkForVaiVaultTransactionError(res);
};

export default withdrawFromVaiVault;
