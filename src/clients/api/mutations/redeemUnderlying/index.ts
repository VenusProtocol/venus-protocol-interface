import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { VBnb, VToken as VTokenContract } from 'packages/contractsNew';

export interface RedeemUnderlyingInput {
  vTokenContract: VTokenContract | VBnb;
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
