import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { VBep20 } from 'types/contracts';

export interface SupplyNonBnbInput {
  tokenContract: VBep20;
  account: string;
  amountWei: BigNumber;
}

export type SupplyNonBnbOutput = TransactionReceipt;

const supplyNonBnb = async ({
  tokenContract,
  account,
  amountWei,
}: SupplyNonBnbInput): Promise<SupplyNonBnbOutput> => {
  const resp = await tokenContract.methods.mint(amountWei.toFixed()).send({ from: account });
  return checkForTokenTransactionError(resp);
};

export default supplyNonBnb;
