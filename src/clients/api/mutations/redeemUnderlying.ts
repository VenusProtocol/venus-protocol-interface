import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { VBep20, VBnbToken } from 'types/contracts';
import { checkForTransactionError } from 'utilities/errors';

export interface IRedeemUnderlyingInput {
  tokenContract: VBep20 | VBnbToken;
  account: string;
  amountWei: BigNumber;
}

export type RedeemUnderlyingOutput = TransactionReceipt;

const redeemUnderlying = async ({
  tokenContract,
  account,
  amountWei,
}: IRedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> => {
  const resp = await tokenContract.methods
    .redeemUnderlying(amountWei.toFixed())
    .send({ from: account });
  return checkForTransactionError(resp);
};

export default redeemUnderlying;
