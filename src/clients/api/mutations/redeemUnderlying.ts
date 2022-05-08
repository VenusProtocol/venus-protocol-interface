import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { VBep20, VBnbToken } from 'types/contracts';

export interface IRedeemUnderlyingInput {
  tokenContract: VBep20 | VBnbToken;
  account: string;
  amount: BigNumber;
}

export type RedeemUnderlyingOutput = TransactionReceipt;

const redeemUnderlying = async ({
  tokenContract,
  account,
  amount,
}: IRedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> =>
  tokenContract.methods.redeemUnderlying(amount.toFixed()).send({ from: account });

export default redeemUnderlying;
