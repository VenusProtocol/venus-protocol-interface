import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VTokenId } from 'types';
import { VTokenContract } from 'clients/contracts/types';

export interface IBorrowVTokenInput {
  vTokenContract: VTokenContract<VTokenId>;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type BorrowVTokenOutput = TransactionReceipt;

const borrowVToken = async ({
  vTokenContract,
  fromAccountAddress,
  amountWei,
}: IBorrowVTokenInput): Promise<BorrowVTokenOutput> =>
  vTokenContract.methods.borrow(amountWei.toFixed()).send({ from: fromAccountAddress });

export default borrowVToken;
