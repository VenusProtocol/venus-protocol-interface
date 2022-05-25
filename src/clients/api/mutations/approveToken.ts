import type { TransactionReceipt } from 'web3-core';

import { Bep20, VaiToken, VrtToken, XvsToken } from 'types/contracts';
import ALLOWANCE_AMOUNT_WEI from 'constants/allowanceAmountWei';

export interface IApproveTokenInput {
  tokenContract: Bep20 | VaiToken | VrtToken | XvsToken;
  accountAddress: string | undefined;
  vtokenAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = TransactionReceipt;

const approveToken = ({
  tokenContract,
  accountAddress,
  vtokenAddress,
  allowance = ALLOWANCE_AMOUNT_WEI,
}: IApproveTokenInput): Promise<ApproveTokenOutput> =>
  tokenContract.methods.approve(vtokenAddress, allowance).send({ from: accountAddress });

export default approveToken;
