import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface RedeemInput {
  tokenContract: ContractTypeByName<'vToken'>;
  amountWei: BigNumber;
}

export type RedeemOutput = ContractReceipt;

const redeem = async ({ tokenContract, amountWei }: RedeemInput): Promise<RedeemOutput> => {
  const transaction = await tokenContract.redeem(amountWei.toFixed());
  const receipt = await transaction.wait(1);
  return checkForTokenTransactionError(receipt);
};

export default redeem;
