import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { VTokenContract } from 'clients/contracts/types';

export interface BorrowVTokenInput {
  vTokenContract: VTokenContract<string>;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type BorrowVTokenOutput = TransactionReceipt;

const borrowVToken = async ({
  vTokenContract,
  fromAccountAddress,
  amountWei,
}: BorrowVTokenInput): Promise<BorrowVTokenOutput> => {
  const resp = await vTokenContract.methods
    .borrow(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForTokenTransactionError(resp);
};

export default borrowVToken;
