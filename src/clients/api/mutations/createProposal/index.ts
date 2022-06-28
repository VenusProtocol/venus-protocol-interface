import type { TransactionReceipt } from 'web3-core';
import { GovernorBravoDelegate } from 'types/contracts';

export interface ICreateProposalInput {
  accountAddress: string;
  targets: string[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
}

export type CreateProposalOutput = TransactionReceipt;

const createProposal = async ({
  governorBravoContract,
  accountAddress,
  targets,
  signatures,
  callDatas,
  description,
}: ICreateProposalInput & {
  governorBravoContract: GovernorBravoDelegate;
}): Promise<CreateProposalOutput> => {
  const resp = await governorBravoContract.methods
    .propose(targets, [0], signatures, callDatas, description)
    .send({ from: accountAddress });
  return resp;
};

export default createProposal;
