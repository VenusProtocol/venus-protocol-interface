import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { VBep20, VBnb } from 'libs/contracts';

export interface RedeemInput {
  tokenContract: VBep20 | VBnb;
  amountMantissa: BigNumber;
}

export type RedeemOutput = ContractTransaction;

const redeem = async ({ tokenContract, amountMantissa }: RedeemInput): Promise<RedeemOutput> =>
  tokenContract.redeem(amountMantissa.toFixed());

export default redeem;
