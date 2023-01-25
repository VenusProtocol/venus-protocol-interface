import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';

import { VBep20 } from 'types/contracts';

export interface RedeemInput {
  tokenContract: VBep20;
  amountWei: BigNumber;
}

export type RedeemOutput = ContractReceipt;

const redeem = async ({ tokenContract, amountWei }: RedeemInput): Promise<RedeemOutput> => {
  const transaction = await tokenContract.redeem(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForTokenTransactionError(receipt);
};

export default redeem;
