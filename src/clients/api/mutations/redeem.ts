import type { TransactionReceipt } from 'web3-core';
import { VBep20 } from 'types/contracts';

export interface IRedeemInput {
  tokenContract: VBep20;
  account: string;
  amount: string;
}

export type RedeemOutput = TransactionReceipt;

const redeem = async ({ tokenContract, account, amount }: IRedeemInput): Promise<RedeemOutput> =>
  tokenContract.methods.redeem(amount).send({ from: account });

export default redeem;
