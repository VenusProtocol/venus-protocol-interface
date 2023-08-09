import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface StakeInVaiVaultInput {
  vaiVaultContract: ContractTypeByName<'vaiVault'>;
  amountWei: BigNumber;
}

export type StakeInVaiVaultOutput = ContractReceipt;

const stakeInVaiVault = async ({
  vaiVaultContract,
  amountWei,
}: StakeInVaiVaultInput): Promise<StakeInVaiVaultOutput> => {
  const transaction = await vaiVaultContract.deposit(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForVaiVaultTransactionError(receipt);
};

export default stakeInVaiVault;
