import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core';

import { VBep20, VBnbToken } from 'types/contracts';

export interface RedeemUnderlyingInput {
  vTokenContract: VBep20 | VBnbToken;
  accountAddress: string;
  amountWei: BigNumber;
}

export type RedeemUnderlyingOutput = TransactionReceipt;

const redeemUnderlying = async ({
  vTokenContract,
  accountAddress,
  amountWei,
}: RedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> => {
  const resp = await vTokenContract.methods
    .redeemUnderlying(amountWei.toFixed())
    .send({ from: accountAddress });

  return checkForTokenTransactionError(resp);
};

export default redeemUnderlying;
