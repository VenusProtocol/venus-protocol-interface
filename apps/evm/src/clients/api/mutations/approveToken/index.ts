import MAX_UINT256 from 'constants/maxUint256';
import type { Bep20, Vai, Vrt, Xvs } from 'libs/contracts';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export interface ApproveTokenInput {
  tokenContract: Vai | Bep20 | Vrt | Xvs;
  spenderAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = ContractTransaction;

const approveToken = async ({
  tokenContract,
  spenderAddress,
  allowance = MAX_UINT256.toFixed(),
}: ApproveTokenInput): Promise<ApproveTokenOutput> =>
  requestGaslessTransaction(tokenContract, 'approve', spenderAddress, allowance);

export default approveToken;
