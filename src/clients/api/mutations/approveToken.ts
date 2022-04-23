import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';
import { Bep20, VaiToken, VrtToken, XvsToken } from 'types/contracts';

export interface IApproveTokenInput {
  tokenContract: Bep20 | VaiToken | VrtToken | XvsToken;
  account: string | undefined;
  vtokenAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = TransactionReceipt;

const approveToken = ({
  tokenContract,
  account,
  vtokenAddress,
  allowance = new BigNumber(2).pow(256).minus(1).toString(10),
}: IApproveTokenInput): Promise<ApproveTokenOutput> =>
  tokenContract.methods.approve(vtokenAddress, allowance).send({ from: account });

export default approveToken;
