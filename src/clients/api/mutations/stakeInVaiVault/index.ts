import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { VaiVault } from 'packages/contractsNew';

export interface StakeInVaiVaultInput {
  vaiVaultContract: VaiVault;
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
