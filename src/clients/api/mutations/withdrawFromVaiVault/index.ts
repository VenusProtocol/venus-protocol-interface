import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { VaiVault } from 'types/contracts';

export interface WithdrawFromVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountWei: BigNumber;
}

export type WithdrawFromVaiVaultOutput = ContractReceipt;

const withdrawFromVaiVault = async ({
  vaiVaultContract,
  amountWei,
}: WithdrawFromVaiVaultInput): Promise<WithdrawFromVaiVaultOutput> => {
  const transaction = await vaiVaultContract.withdraw(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForVaiVaultTransactionError(receipt);
};

export default withdrawFromVaiVault;
