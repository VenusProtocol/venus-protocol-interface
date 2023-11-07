import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { VBep20, VBnb } from 'packages/contracts';

export interface BorrowInput {
  vTokenContract: VBep20 | VBnb;
  amountWei: BigNumber;
}

export type BorrowOutput = ContractTransaction;

const borrow = async ({ vTokenContract, amountWei }: BorrowInput): Promise<BorrowOutput> =>
  vTokenContract.borrow(amountWei.toFixed());

export default borrow;
