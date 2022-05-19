import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';
import { checkForTransactionError } from 'utilities/errors';
import { VBep20 } from 'types/contracts';

export interface ISupplyNonBnbInput {
  tokenContract: VBep20;
  account: string;
  amountWei: BigNumber;
}

export type SupplyNonBnbOutput = TransactionReceipt;

const supplyNonBnb = async ({
  tokenContract,
  account,
  amountWei,
}: ISupplyNonBnbInput): Promise<SupplyNonBnbOutput> => {
  const resp = await tokenContract.methods.mint(amountWei.toFixed()).send({ from: account });
  return checkForTransactionError(resp);
};

export default supplyNonBnb;
