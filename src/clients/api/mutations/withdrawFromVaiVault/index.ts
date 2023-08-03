import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface WithdrawFromVaiVaultInput {
  vaiVaultContract: ContractTypeByName<'vaiVault'>;
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
