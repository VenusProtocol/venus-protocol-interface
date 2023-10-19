import { ContractReceipt } from 'ethers';
import { Bep20, Vai, Vrt, Xvs } from 'packages/contracts';

import MAX_UINT256 from 'constants/maxUint256';

export interface ApproveTokenInput {
  tokenContract: Vai | Bep20 | Vrt | Xvs;
  spenderAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = ContractReceipt;

const approveToken = async ({
  tokenContract,
  spenderAddress,
  allowance = MAX_UINT256.toFixed(),
}: ApproveTokenInput): Promise<ApproveTokenOutput> => {
  const transaction = await tokenContract.approve(spenderAddress, allowance);
  return transaction.wait(1);
};

export default approveToken;
