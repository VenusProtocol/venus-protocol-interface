import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface BorrowInput {
  vTokenContract: ContractTypeByName<'vToken' | 'vBnb'>;
  amountWei: BigNumber;
}

export type BorrowOutput = ContractReceipt;

const borrow = async ({ vTokenContract, amountWei }: BorrowInput): Promise<BorrowOutput> => {
  const transaction = await vTokenContract.borrow(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForTokenTransactionError(receipt);
};

export default borrow;
