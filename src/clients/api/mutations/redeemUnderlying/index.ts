import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { VBep20, VBnb } from 'packages/contracts';

export interface RedeemUnderlyingInput {
  vTokenContract: VBep20 | VBnb;
  amountWei: BigNumber;
}

export type RedeemUnderlyingOutput = ContractReceipt;

const redeemUnderlying = async ({
  vTokenContract,
  amountWei,
}: RedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> => {
  const transaction = await vTokenContract.redeemUnderlying(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForTokenTransactionError(receipt);
};

export default redeemUnderlying;
