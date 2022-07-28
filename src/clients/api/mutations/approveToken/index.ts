import type { TransactionReceipt } from 'web3-core';

import ALLOWANCE_AMOUNT_WEI from 'constants/allowanceAmountWei';
import { Bep20, VaiToken, VrtToken, XvsToken } from 'types/contracts';

export interface ApproveTokenInput {
  tokenContract: Bep20 | VaiToken | VrtToken | XvsToken;
  accountAddress: string;
  spenderAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = TransactionReceipt;

const approveToken = ({
  tokenContract,
  accountAddress,
  spenderAddress,
  allowance = ALLOWANCE_AMOUNT_WEI,
}: ApproveTokenInput): Promise<ApproveTokenOutput> =>
  tokenContract.methods.approve(spenderAddress, allowance).send({ from: accountAddress });

export default approveToken;
