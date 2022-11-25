import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { VBep20, VBnbToken } from 'types/contracts';

export interface BorrowInput {
  vTokenContract: VBep20 | VBnbToken;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type BorrowOutput = TransactionReceipt;

const borrow = async ({
  vTokenContract,
  fromAccountAddress,
  amountWei,
}: BorrowInput): Promise<BorrowOutput> => {
  const resp = await vTokenContract.methods
    .borrow(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForTokenTransactionError(resp);
};

export default borrow;
