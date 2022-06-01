import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';
import { checkForTokenTransactionError } from 'errors';

import { VBep20 } from 'types/contracts';

export interface IRedeemInput {
  tokenContract: VBep20;
  account: string;
  amountWei: BigNumber;
}

export type RedeemOutput = TransactionReceipt;

const redeem = async ({
  tokenContract,
  account,
  amountWei,
}: IRedeemInput): Promise<RedeemOutput> => {
  const resp = await tokenContract.methods.redeem(amountWei.toFixed()).send({ from: account });
  return checkForTokenTransactionError(resp);
};

export default redeem;
