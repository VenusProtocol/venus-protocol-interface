import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { VBep20, VBnb } from 'packages/contracts';

export interface RedeemInput {
  tokenContract: VBep20 | VBnb;
  amountWei: BigNumber;
}

export type RedeemOutput = ContractTransaction;

const redeem = async ({ tokenContract, amountWei }: RedeemInput): Promise<RedeemOutput> =>
  tokenContract.redeem(amountWei.toFixed());

export default redeem;
