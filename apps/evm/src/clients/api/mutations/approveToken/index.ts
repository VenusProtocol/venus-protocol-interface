import MAX_UINT256 from 'constants/maxUint256';
import type { Bep20, Vai, Vrt, Xvs } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface ApproveTokenInput {
  tokenContract: Vai | Bep20 | Vrt | Xvs;
  spenderAddress: string;
  allowance?: string;
}

type ContractsWithApprove = Bep20 | Vai | Vrt | Xvs;

export type ApproveTokenOutput = ContractTxData<ContractsWithApprove, 'approve'>;

const approveToken = async ({
  tokenContract,
  spenderAddress,
  allowance = MAX_UINT256.toFixed(),
}: ApproveTokenInput): Promise<ApproveTokenOutput> => ({
  contract: tokenContract,
  methodName: 'approve',
  args: [spenderAddress, allowance],
});

export default approveToken;
