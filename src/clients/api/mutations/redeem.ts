import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { VBep20 } from 'types/contracts';

export interface IRedeemInput {
  tokenContract: VBep20;
  account: string;
  amountWei: BigNumber;
}

export type RedeemOutput = TransactionReceipt;

const redeem = async ({ tokenContract, account, amountWei }: IRedeemInput): Promise<RedeemOutput> =>
  tokenContract.methods.redeem(amountWei.toFixed()).send({ from: account });

export default redeem;
