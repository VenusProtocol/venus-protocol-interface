import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { checkForVaiVaultTransactionError } from 'errors';
import { VaiVault } from 'types/contracts';

export interface IWithdrawFromVaiVaultInput {
  vaiVaultContract: VaiVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type WithdrawFromVaiVaultOutput = TransactionReceipt;

const withdrawFromVaiVault = async ({
  vaiVaultContract,
  fromAccountAddress,
  amountWei,
}: IWithdrawFromVaiVaultInput): Promise<WithdrawFromVaiVaultOutput> => {
  const res = await vaiVaultContract.methods
    .withdraw(amountWei.toFixed())
    .send({ from: fromAccountAddress });

  return checkForVaiVaultTransactionError(res);
};

export default withdrawFromVaiVault;
