import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { VBnb, VToken as VTokenContract } from 'packages/contractsNew';

export interface BorrowInput {
  vTokenContract: VTokenContract | VBnb;
  amountWei: BigNumber;
}

export type BorrowOutput = ContractReceipt;

const borrow = async ({ vTokenContract, amountWei }: BorrowInput): Promise<BorrowOutput> => {
  const transaction = await vTokenContract.borrow(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForTokenTransactionError(receipt);
};

export default borrow;
