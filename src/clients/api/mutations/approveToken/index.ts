import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

import ALLOWANCE_AMOUNT_WEI from 'constants/allowanceAmountWei';

export interface ApproveTokenInput {
  tokenContract: ContractTypeByName<'vai' | 'bep20' | 'vrt' | 'xvs'>;
  spenderAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = ContractReceipt;

const approveToken = async ({
  tokenContract,
  spenderAddress,
  allowance = ALLOWANCE_AMOUNT_WEI,
}: ApproveTokenInput): Promise<ApproveTokenOutput> => {
  const transaction = await tokenContract.approve(spenderAddress, allowance);
  return transaction.wait(1);
};

export default approveToken;
